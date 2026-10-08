// Formats the ISO build timestamp for the footer, e.g. "Oct 7, 2026, 5:25 PM",
// always in Buenos Aires time regardless of the viewer's time zone.
export function formatBuildDate(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
        timeZone: 'America/Buenos_Aires',
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}
