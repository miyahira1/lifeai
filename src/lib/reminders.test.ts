import { describe, expect, it } from 'vitest';
import { isReminderDue, snoozedReminderTime, toReminderTime, toWeekday } from './reminders';

// Local-time dates, since reminders are matched against the browser's local clock.
const wedAt0930 = new Date(2026, 9, 7, 9, 30); // Wed Oct 7, 2026 09:30
const wedAt1745 = new Date(2026, 9, 7, 17, 45);

describe('toReminderTime / toWeekday', () => {
    it('produces zero-padded 24h HH:MM and short weekday names', () => {
        expect(toReminderTime(wedAt0930)).toBe('09:30');
        expect(toReminderTime(wedAt1745)).toBe('17:45');
        expect(toWeekday(wedAt0930)).toBe('Wed');
    });
});

describe('isReminderDue', () => {
    const base = { reminderTime: '09:30', recurrence: [] as string[], completed: false };

    it('fires when the reminder time matches the current minute', () => {
        expect(isReminderDue(base, wedAt0930)).toBe(true);
    });

    it('does not fire at a different time or without a reminder time', () => {
        expect(isReminderDue(base, wedAt1745)).toBe(false);
        expect(isReminderDue({ ...base, reminderTime: '' }, wedAt0930)).toBe(false);
        expect(isReminderDue({ ...base, reminderTime: undefined }, wedAt0930)).toBe(false);
    });

    it('respects recurrence days', () => {
        expect(isReminderDue({ ...base, recurrence: ['Mon', 'Wed'] }, wedAt0930)).toBe(true);
        expect(isReminderDue({ ...base, recurrence: ['Mon', 'Tue'] }, wedAt0930)).toBe(false);
    });

    it('does not fire for completed tasks', () => {
        expect(isReminderDue({ ...base, completed: true }, wedAt0930)).toBe(false);
    });
});

describe('snoozedReminderTime', () => {
    it('adds the snooze minutes to the reminder time', () => {
        expect(snoozedReminderTime('09:30', 10, wedAt0930)).toBe('09:40');
        expect(snoozedReminderTime('09:55', 30, wedAt0930)).toBe('10:25');
        expect(snoozedReminderTime('17:45', 120, wedAt0930)).toBe('19:45');
    });

    it('wraps past midnight', () => {
        expect(snoozedReminderTime('23:50', 30, wedAt0930)).toBe('00:20');
    });
});
