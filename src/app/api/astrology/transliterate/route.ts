import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { ASTROLOGY_LANGUAGES, LANGUAGE_LABELS, type AstrologyLanguage } from "@/lib/astrology/i18n";

/**
 * Server-side transliteration for languages beyond the local ta/ml dictionary+phonetic
 * engine (src/lib/transliteration). Cached in TransliterationCache so repeated names never
 * re-hit the LLM. Falls back to returning the raw Latin text if no API key is configured or
 * the call fails — the field is never blocked on an LLM being available.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const word = url.searchParams.get("word")?.trim() ?? "";
  const lang = url.searchParams.get("lang")?.trim() ?? "";
  if (!word || !ASTROLOGY_LANGUAGES.includes(lang as AstrologyLanguage) || lang === "en") {
    return NextResponse.json({ result: word });
  }
  const language = lang as AstrologyLanguage;

  const cached = await prisma.transliterationCache.findUnique({
    where: { latin_language: { latin: word.toLowerCase(), language } },
  });
  if (cached) return NextResponse.json({ result: cached.result });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ result: word });

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://myloginn.com",
        "X-Title": "MyLoginn Astrology",
      },
    });

    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      max_tokens: 60,
      messages: [
        {
          role: "user",
          content: `Transliterate this Indian personal name, written in Latin script, into ${LANGUAGE_LABELS[language]} native script (phonetic transliteration, not translation — keep it as a name). Name: "${word}". Reply with ONLY the transliterated name in ${LANGUAGE_LABELS[language]} script, nothing else — no quotes, no explanation.`,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim();
    if (!result) return NextResponse.json({ result: word });

    await prisma.transliterationCache.upsert({
      where: { latin_language: { latin: word.toLowerCase(), language } },
      update: { result },
      create: { latin: word.toLowerCase(), language, result },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Transliteration LLM call failed, using raw text:", error);
    return NextResponse.json({ result: word });
  }
}
