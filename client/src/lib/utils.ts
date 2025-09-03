import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple Tailwind CSS class names intelligently.
 *
 * Example:
 * cn("p-4", isActive && "bg-blue-500", "text-white");
 * => "p-4 bg-blue-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}