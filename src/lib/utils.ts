import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber: (value: number | bigint) => string = new Intl.NumberFormat().format;

export const getStatusColor = {
  CANCELLED:" text-red-500",
  DELIVERED:" text-green-500",
  PENDING: " text-yellow-500",
  PROCESSING: " text-yellow-500",
  SHIPPED: " text-[#9fbe00]",
}