import nodemailer from "nodemailer";
import { Resend } from "resend";
import { CONTACT_EMAILS, CONTACT_PHONES, CONTACT_HOURS, SOCIAL_LINKS, COMPANY_NAME } from "./contactInfo";

const purposeCopy: Record<string, { subject: string; intro: string }> = {
  signup: { subject: "Verify your MyLoginn email", intro: "Use this code to finish creating your account." },
  login: { subject: "Your MyLoginn sign-in code", intro: "Use this code to sign in." },
  reset: { subject: "Reset your MyLoginn password", intro: "Use this code to reset your password." },
};

/**
 * Full transactional email shell: brand header, code panel, explicit
 * anti-phishing notice, and a footer with real contact info + socials
 * (sourced from contactInfo.ts, never hardcoded here). Inline-styled only —
 * email clients strip external CSS/JS — and kept inside a 600px-max table
 * layout for the widest client compatibility (incl. Outlook's table-based
 * rendering engine). No hosted logo image exists anywhere in the codebase
 * (the navbar logo is a bundled next/image asset with a hashed build path,
 * not a stable public URL), so the brand mark here is a polished two-tone
 * typographic lockup instead of an <img> that would just break.
 */
function otpHtml(code: string, intro: string) {
  const year = new Date().getFullYear();
  const generalEmail = CONTACT_EMAILS.find((e) => e.key === "general")?.email ?? CONTACT_EMAILS[0].email;
  const businessEmail = CONTACT_EMAILS.find((e) => e.key === "business")?.email ?? CONTACT_EMAILS[0].email;
  const primaryPhone = CONTACT_PHONES[0];
  const socialLinksHtml = SOCIAL_LINKS.map(
    (s) => `<a href="${s.href}" style="color:#6c4dff;text-decoration:none;">${s.label}</a>`
  ).join(`<span style="color:#d7d9ea;">&nbsp;&middot;&nbsp;</span>`);

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f8;padding:32px 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(11,13,23,0.07);">
            <!-- Accent bar -->
            <tr>
              <td height="5" bgcolor="#6c4dff" style="background:linear-gradient(90deg,#5934f0,#6c4dff 55%,#06b6d4);line-height:5px;font-size:1px;">&nbsp;</td>
            </tr>
            <!-- Header / logo -->
            <tr>
              <td style="padding:28px 32px 20px;border-bottom:1px solid #f0f0f7;">
                <span style="font-size:24px;font-weight:800;letter-spacing:-0.3px;">
                  <span style="color:#6c4dff;">My</span><span style="color:#0b0d17;">Loginn</span>
                </span>
                <div style="margin-top:4px;font-size:10.5px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#9296b3;">
                  ${COMPANY_NAME}
                </div>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:28px 32px 4px;">
                <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#333650;">${intro}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f2f1ff,#e0f7fa);border-radius:14px;">
                  <tr>
                    <td align="center" style="padding:24px;">
                      <span style="font-size:32px;font-weight:800;letter-spacing:10px;color:#5934f0;">${code}</span>
                    </td>
                  </tr>
                </table>
                <p style="margin:18px 0 0;font-size:13px;color:#5b5f75;">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
              </td>
            </tr>
            <!-- Security notice -->
            <tr>
              <td style="padding:20px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fde3c7;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0;font-size:12.5px;line-height:1.65;color:#9a5b1e;">
                        <strong>Keep this code to yourself.</strong> If you didn't request it, someone may be
                        trying to access your account — do not share it with anyone, including people claiming
                        to be MyLoginn support. MyLoginn staff will never call, text, or email you asking for
                        this code.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:28px 32px 32px;">
                <div style="border-top:1px solid #eceaf7;padding-top:20px;">
                  <p style="margin:0 0 10px;font-size:12px;color:#9296b3;">Questions about this email or your account?</p>
                  <p style="margin:0 0 6px;font-size:12.5px;color:#5b5f75;">
                    <a href="mailto:${generalEmail}" style="color:#6c4dff;text-decoration:none;">${generalEmail}</a>
                    <span style="color:#d7d9ea;">&nbsp;&middot;&nbsp;</span>
                    <a href="mailto:${businessEmail}" style="color:#6c4dff;text-decoration:none;">${businessEmail}</a>
                  </p>
                  <p style="margin:0 0 6px;font-size:12.5px;color:#5b5f75;">${primaryPhone.display} &nbsp;&bull;&nbsp; ${CONTACT_HOURS}</p>
                  <p style="margin:0 0 18px;font-size:12.5px;">${socialLinksHtml}</p>
                  <p style="margin:0;font-size:11px;color:#b3b6c9;">&copy; ${year} ${COMPANY_NAME}. All rights reserved.</p>
                  <p style="margin:6px 0 0;font-size:11px;color:#c7c9db;">This is an automated message — please don't reply directly to this email.</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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

/**
 * Shared provider chain — first configured provider that accepts the send wins.
 * A provider that is configured but rejects the send (e.g. Resend testing mode
 * only delivers to the account owner's address until a domain is verified) must
 * not dead-end the caller — log the reason and fall through to the next provider.
 * Returns true if actually emailed via a real provider, false if every provider
 * was unconfigured/failed (caller decides on a dev-mode fallback, e.g. console log).
 */
async function sendHtmlEmail(to: string, subject: string, html: string, logTag: string): Promise<boolean> {
  const providers = [
    { name: "resend", send: sendViaResend },
    { name: "gmail", send: sendViaGmail },
    { name: "brevo", send: sendViaBrevo },
  ];
  for (const provider of providers) {
    try {
      if (await provider.send(to, subject, html)) return true;
    } catch (error) {
      console.error(`[${logTag}] ${provider.name} failed for ${to}:`, error instanceof Error ? error.message : error);
    }
  }
  return false;
}

/** Returns true if the code was actually emailed via a real provider, false if it only hit the dev-mode console fallback. */
export async function sendOtpEmail(to: string, code: string, purpose: string): Promise<boolean> {
  const copy = purposeCopy[purpose] ?? purposeCopy.signup;
  const html = otpHtml(code, copy.intro);
  const sent = await sendHtmlEmail(to, copy.subject, html, "otp-email");
  if (sent) return true;

  // Fallback: no provider configured, or every configured one refused the
  // recipient. Log server-side; the caller surfaces the code as devCode.
  console.log(`[dev-otp] ${purpose} code for ${to}: ${code}`);
  return false;
}

