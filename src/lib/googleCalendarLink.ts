/** Builds a no-OAuth "Add to Google Calendar" link — works even if the viewer hasn't connected their Google account. */
export function buildGoogleCalendarLink(event: {
  title: string;
  description?: string | null;
  startsAt: Date | string;
  endsAt: Date | string;
  location?: string | null;
}) {
  const fmt = (d: Date | string) =>
    new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.startsAt)}/${fmt(event.endsAt)}`,
  });
  if (event.description) params.set("details", event.description);
  if (event.location) params.set("location", event.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
