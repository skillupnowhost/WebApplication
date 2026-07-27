import OpenAI from "openai";
import type { ChatCompletionChunk } from "openai/resources/chat/completions";
import type { Stream } from "openai/streaming";
import { NextResponse } from "next/server";
import { loadReportView } from "@/lib/astrology/report";
import { MANDI_HOUSE_THEME } from "@/lib/astrology/mandi";
import { LANGUAGE_LABELS } from "@/lib/astrology/i18n";
import { rashiLabel, nakshatraLabel } from "@/lib/astrology/chartLayout";
import { CONTACT_EMAILS } from "@/lib/contactInfo";

export const runtime = "nodejs";

const MAX_TURNS = 12;
const MAX_MESSAGE_CHARS = 1000;

type ChatTurn = { role: "user" | "assistant"; content: string };

function isChatTurn(value: unknown): value is ChatTurn {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string" &&
    v.content.length > 0 &&
    v.content.length <= MAX_MESSAGE_CHARS
  );
}

function buildSystemPrompt(view: NonNullable<Awaited<ReturnType<typeof loadReportView>>>) {
  const astrologyEmail = CONTACT_EMAILS.find((e) => e.key === "astrology")?.email ?? CONTACT_EMAILS[0].email;
  const languageName = LANGUAGE_LABELS[view.language];

  if (!view.mandi) {
    return `You are MyLoginn Astrology's assistant for ${view.fullName}'s birth chart. Their Mandi (Gulika) position could not be computed for this chart (birth time may be marked unknown). Explain this plainly and suggest they regenerate the report with a known birth time, or contact ${astrologyEmail}. Respond only in ${languageName} (language code "${view.language}"), in plain conversational text with no markdown.`;
  }

  const houseNum = view.mandi.houseFromAscendant;
  const rashi = rashiLabel(view.mandi.rashi.index, "en");
  const nakshatra = nakshatraLabel(view.mandi.nakshatra, "en");
  const classicalTheme = MANDI_HOUSE_THEME[houseNum]?.en ?? "";

  return `You are MyLoginn Astrology's assistant, answering questions about ONE specific placement in ${view.fullName}'s Vedic birth chart: Mandi (also called Gulika), the shadow point/upagraha classically read for obstacles, delays, and the house-specific themes it colors.

This chart's computed Mandi placement:
- House from Lagna (ascendant): ${houseNum}
- Rashi (sign): ${rashi}
- Nakshatra: ${nakshatra}, Pada ${view.mandi.nakshatra.pada}
- Classical theme for Mandi in house ${houseNum}: "${classicalTheme}"

How to behave:
- Answer only questions about what Mandi's placement in house ${houseNum} means/predicts for this person — its significance for the life area that house governs, general remedies or cautions classically associated with Mandi there, and closely related follow-up questions about this specific chart's Mandi.
- Ground every answer in the placement data above; don't invent other planetary positions or details not given here. If asked about something outside Mandi/this chart (other planets, unrelated topics), politely redirect to the astrology contact channel: ${astrologyEmail}.
- Be warm, concise (2-5 sentences unless asked for more), and specific — reference the actual house/rashi/nakshatra above rather than generic filler.
- This is traditional astrological interpretation for reflection, not deterministic fact or professional (medical/legal/financial) advice — keep that framing implicit in tone, don't lecture about it every message.
- Respond ONLY in ${languageName} (language code "${view.language}"), regardless of what language the question is asked in. Plain conversational text — no markdown headings, bold, or tables.`;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The AI assistant isn't configured yet." }, { status: 503 });
  }

  const view = await loadReportView(id);
  if (!view) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || !rawMessages.every(isChatTurn)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }
  if (rawMessages[rawMessages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Last message must be from the user" }, { status: 400 });
  }

  const history = rawMessages.slice(-MAX_TURNS).map((m) => ({ role: m.role, content: m.content }));
  const system = buildSystemPrompt(view);
  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://myloginn.com",
      "X-Title": "MyLoginn Astrology Chat",
    },
  });

  let stream: Stream<ChatCompletionChunk>;
  try {
    stream = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      max_tokens: 700,
      stream: true,
      messages: [{ role: "system" as const, content: system }, ...history],
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("Astrology chat API error:", error.status, error.message);
      const friendly =
        error.status === 401
          ? "The AI assistant's API key is invalid."
          : error.code === "insufficient_quota"
            ? "The AI assistant's account has run out of credits."
            : "The AI assistant is temporarily unavailable. Please try again in a moment.";
      return NextResponse.json({ error: friendly }, { status: 502 });
    }
    throw error;
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
        controller.close();
      } catch (error) {
        console.error("Astrology chat stream error:", error);
        controller.error(error);
      }
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
