import { describe, expect, it } from 'vitest';
import { formatBuildDate } from './buildDate';

describe('formatBuildDate', () => {
    it('formats a UTC build timestamp in Buenos Aires time (UTC-3)', () => {
        expect(formatBuildDate('2026-10-07T20:25:55.503Z')).toBe('Oct 7, 2026, 5:25 PM');
    });

    it('rolls the date back when the UTC time is past midnight but Buenos Aires is not', () => {
        expect(formatBuildDate('2026-01-01T02:30:00Z')).toBe('Dec 31, 2025, 11:30 PM');
    });
});
