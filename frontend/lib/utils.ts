import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercentile(percentile: number): string {
  if (percentile >= 90) return `Top ${100 - Math.floor(percentile)}%`
  if (percentile >= 75) return `Top ${100 - Math.floor(percentile)}%`
  if (percentile >= 50) return `Top ${100 - Math.floor(percentile)}%`
  return `${Math.floor(percentile)}th percentile`
}

export function getPercentileColor(percentile: number): string {
  if (percentile >= 90) return "text-green-600"
  if (percentile >= 75) return "text-blue-600"
  if (percentile >= 50) return "text-yellow-600"
  return "text-gray-600"
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-blue-600"
  if (score >= 40) return "text-yellow-600"
  return "text-red-600"
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
