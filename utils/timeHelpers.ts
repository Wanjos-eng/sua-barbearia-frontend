import type { TimeSlot } from '@/types/professional';

/**
 * Format TimeSlot object to HH:mm string
 */
export function formatTimeSlot(time: TimeSlot | string | undefined | null): string {
    if (!time) return '--:--';

    if (typeof time === 'string') {
        return time.substring(0, 5);
    }

    if (typeof time === 'object' && time !== null) {
        const h = (time.hour || 0).toString().padStart(2, '0');
        const m = (time.minute || 0).toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    return '--:--';
}

/**
 * Generate time slots for a day (e.g., ['08:00', '08:30', '09:00', ...])
 */
export function generateTimeSlots(start: number = 8, end: number = 20, intervalMinutes: number = 30): string[] {
    const slots: string[] = [];

    for (let hour = start; hour < end; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            slots.push(`${h}:${m}`);
        }
    }

    return slots;
}

/**
 * Parse time string to TimeSlot object
 */
export function parseTimeString(time: string): TimeSlot {
    const [hour, minute] = time.split(':').map(Number);
    return {
        hour: hour || 0,
        minute: minute || 0,
        second: 0,
        nano: 0
    };
}

/**
 * Check if a time is within a range
 */
export function isTimeInRange(time: string, start: string, end: string): boolean {
    return time >= start && time < end;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get day of week (1=Monday, 7=Sunday)
 */
export function getDayOfWeek(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 7 : day;
}

/**
 * Day names in Portuguese
 */
export const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/**
 * Get day name in Portuguese
 */
export function getDayName(date: Date): string {
    return DAY_NAMES[date.getDay()];
}
