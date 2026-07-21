import { google, type calendar_v3 } from "googleapis";
import type { Readable } from "node:stream";
import { prisma } from "./prisma";
import { encryptToken, decryptToken } from "./crypto";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/drive.file",
];

export function isGoogleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);
}

export function buildOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/** Loads the caller's stored Google tokens and returns an authenticated client, or null if not connected. */
export async function getGoogleClient(userId: string) {
  const account = await prisma.googleAccount.findUnique({ where: { userId } });
  if (!account) return null;

  const oauth2Client = buildOAuthClient();
  oauth2Client.setCredentials({
    access_token: decryptToken(account.accessToken),
    refresh_token: decryptToken(account.refreshToken),
    expiry_date: account.expiryDate.getTime(),
  });

  // googleapis refreshes the access token transparently on API calls once
  // it's expired; persist whatever it hands back so the next call reuses it.
  oauth2Client.on("tokens", (tokens) => {
    void prisma.googleAccount
      .update({
        where: { userId },
        data: {
          ...(tokens.access_token && { accessToken: encryptToken(tokens.access_token) }),
          ...(tokens.refresh_token && { refreshToken: encryptToken(tokens.refresh_token) }),
          ...(tokens.expiry_date && { expiryDate: new Date(tokens.expiry_date) }),
        },
      })
      .catch((err) => console.error("Failed to persist refreshed Google tokens", err));
  });

  return oauth2Client;
}

export async function createCalendarEvent(userId: string, event: calendar_v3.Schema$Event) {
  const auth = await getGoogleClient(userId);
  if (!auth) return null;
  const calendar = google.calendar({ version: "v3", auth });
  const { data } = await calendar.events.insert({ calendarId: "primary", requestBody: event });
  return data;
}

export async function updateCalendarEvent(userId: string, eventId: string, event: calendar_v3.Schema$Event) {
  const auth = await getGoogleClient(userId);
  if (!auth) return null;
  const calendar = google.calendar({ version: "v3", auth });
  const { data } = await calendar.events.update({ calendarId: "primary", eventId, requestBody: event });
  return data;
}

export async function deleteCalendarEvent(userId: string, eventId: string) {
  const auth = await getGoogleClient(userId);
  if (!auth) return;
  const calendar = google.calendar({ version: "v3", auth });
  await calendar.events.delete({ calendarId: "primary", eventId }).catch((err: unknown) => {
    const code = (err as { code?: number })?.code;
    if (code !== 404 && code !== 410) throw err;
  });
}

export async function uploadRecordingToDrive(
  userId: string,
  filename: string,
  mimeType: string,
  body: Readable
) {
  const auth = await getGoogleClient(userId);
  if (!auth) throw new Error("Google Drive is not connected for this mentor.");
  const drive = google.drive({ version: "v3", auth });
  const { data } = await drive.files.create({
    requestBody: { name: filename },
    media: { mimeType, body },
    fields: "id, webViewLink",
  });
  return data;
}
