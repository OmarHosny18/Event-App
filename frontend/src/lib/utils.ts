import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string | Date): string {
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "PPP"); // e.g., "Apr 29, 2023"
  } catch (error) {
    return "Invalid date";
  }
}

// Format date and time for display
export function formatDateTime(date: string | Date): string {
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "PPP p"); // e.g., "Apr 29, 2023 at 9:00 AM"
  } catch (error) {
    return "Invalid date";
  }
}

// Format date for API (ISO format)
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}

// Truncate text
// Truncate text safely
export function truncateText(
  text: string | undefined | null,
  maxLength: number
): string {
  if (!text) return ""; // prevents crash if undefined or null
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate random color for avatars
export function generateAvatarColor(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
