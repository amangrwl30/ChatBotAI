import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 * - clsx handles conditional className logic
 * - tailwind-merge prevents conflicting Tailwind classes (e.g., p-4 vs p-2)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

// For proper typing
import type { ClassValue } from "clsx";