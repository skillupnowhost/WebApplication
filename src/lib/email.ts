import nodemailer from "nodemailer";
import { Resend } from "resend";

const purposeCopy: Record<string, { subject: string; intro: string }> = {
  signup: { subject: "Verify your MyLoginn email", intro: "Use this code to finish creating your account." },
  login: { subject: "Your MyLoginn sign-in code", intro: "Use this code to sign in." },
  reset: { subject: "Reset your MyLoginn password", intro: "Use this code to reset your password." },
};

function otpHtml(code: string, intro: string) {
  return `
    <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px 24px;">
      <h2 style="margin:0 0 8px;font-size:22px;">
        <span style="color:#6c4dff;">My</span><span style="color:#0b0d17;">Loginn</span>
      </h2>
      <p style="color:#5b5f75;font-size:14px;margin:0 0 24px;">${intro}</p>
      <div style="background:linear-gradient(135deg,#f2f1ff,#e0f7fa);border-radius:14px;padding:22px;text-align:center;">
        <span style="font-size:30px;font-weight:700;letter-spacing:9px;color:#6c4dff;">${code}</span>
      </div>
      <p style="color:#9296b3;font-size:12px;margin:24px 0 0;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
}

/**
 * Free providers, tried in order — the first one with credentials wins:
 *  1. Resend (RESEND_API_KEY) — primary provider, free tier 3,000 mails/month.
 *  2. Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD) — 100% free, ~500 mails/day.
 *  3. Brevo REST API (BREVO_API_KEY) — free tier, 300 mails/day, no domain needed.
 */
async function sendViaGmail(to: string, subject: string, html: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `MyLoginn <${user}>`,
    to,
    subject,
    html,
  });
  return true;
}

async function sendViaBrevo(to: string, subject: string, html: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  const sender = process.env.BREVO_FROM_EMAIL ?? process.env.GMAIL_USER ?? "mailloginn@gmail.com";
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "MyLoginn", email: sender },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo rejected the email (${res.status}): ${body}`);
  }
  return true;
}

async function sendViaResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "MyLoginn <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
  if (error) {
    throw new Error(error.message ?? "Failed to send verification email");
  }
  return true;
}

/** Returns true if the code was actually emailed via a real provider, false if it only hit the dev-mode console fallback. */
export async function sendOtpEmail(to: string, code: string, purpose: string): Promise<boolean> {
  const copy = purposeCopy[purpose] ?? purposeCopy.signup;
  const html = otpHtml(code, copy.intro);

  // A provider that is configured but rejects the send (e.g. Resend testing
  // mode only delivers to the account owner's address until a domain is
  // verified) must not dead-end the signup/login flow — log the reason and
  // fall through to the next provider, then to the dev-code fallback.
  const providers = [
    { name: "resend", send: sendViaResend },
    { name: "gmail", send: sendViaGmail },
    { name: "brevo", send: sendViaBrevo },
  ];
  for (const provider of providers) {
    try {
      if (await provider.send(to, copy.subject, html)) return true;
    } catch (error) {
      console.error(`[otp-email] ${provider.name} failed for ${to}:`, error instanceof Error ? error.message : error);
    }
  }

  // Fallback: no provider configured, or every configured one refused the
  // recipient. Log server-side; the caller surfaces the code as devCode.
  console.log(`[dev-otp] ${purpose} code for ${to}: ${code}`);
  return false;
}
