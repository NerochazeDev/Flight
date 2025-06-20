import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(numPrice);
}

export function formatDuration(duration: string): string {
  return duration.replace(/(\d+)h\s*(\d+)m/, "$1h $2m");
}

export function generateBookingReference(): string {
  return `FH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}
