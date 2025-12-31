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
 * This ensures consistency between local development and global deployments (UTC)
 */
export function getToday(): Date {
  const now = new Date();
  // If we're on the server, adjust for UTC+6 (Bangladesh)
  // This is a simple way to fix the "31st Dec instead of 1st Jan" issue
  const offset = 6; // Bangladesh is UTC+6
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localToday = new Date(utc + (3600000 * offset));
  return localToday;
}
