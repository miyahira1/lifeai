import type { Task } from './db';

// "HH:MM" in 24h form, matching how reminder times are stored.
export function toReminderTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

// Short weekday ("Mon", "Tue", ...), matching how recurrence days are stored.
export function toWeekday(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Whether a task's reminder should fire at the given moment.
export function isReminderDue(task: Pick<Task, 'reminderTime' | 'recurrence' | 'completed'>, now: Date): boolean {
    if (!task.reminderTime) return false;
    if (task.reminderTime !== toReminderTime(now)) return false;
    // If recurrence is set, today must be in the list
    if (task.recurrence && task.recurrence.length > 0 && !task.recurrence.includes(toWeekday(now))) return false;
    // Completed tasks don't get reminders
    if (task.completed) return false;
    return true;
}

// New reminder time after snoozing `minutes` from the current reminder time.
export function snoozedReminderTime(reminderTime: string, minutes: number, base: Date = new Date()): string {
    const [hours, mins] = reminderTime.split(':').map(Number);
    const date = new Date(base);
    date.setHours(hours, mins + minutes);
    return toReminderTime(date);
}
