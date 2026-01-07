import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Returns today's date adjusted for Bangladesh timezone (UTC+6)
 * Normalized to UTC so that UTC getters (getUTCFullYear, etc.) return BD time parts.
 */
export function getToday(): Date {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    const parts: Record<string, string> = {};
    formatter.formatToParts(now).forEach(p => parts[p.type] = p.value);
    
    const year = parseInt(parts.year);
    const month = parseInt(parts.month);
    const day = parseInt(parts.day);
    const hour = parseInt(parts.hour);
    const minute = parseInt(parts.minute);
    const second = parseInt(parts.second);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date parts');
    }

    return new Date(Date.UTC(
      year,
      month - 1,
      day,
      isNaN(hour) ? 0 : hour,
      isNaN(minute) ? 0 : minute,
      isNaN(second) ? 0 : second
    ));
  } catch (error) {
    console.error('Error in getToday:', error);
    // Fallback block - add 6 hours to current UTC time for Asia/Dhaka
    const fallback = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    return new Date(Date.UTC(
        fallback.getUTCFullYear(),
        fallback.getUTCMonth(),
        fallback.getUTCDate(),
        fallback.getUTCHours(),
        fallback.getUTCMinutes(),
        fallback.getUTCSeconds()
    ));
  }
}
