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

/**
 * Strip markdown formatting and return clean plain text for previews
 */
export function stripMarkdown(text: string): string {
  if (!text) return ''

  return text
    // Remove headers (# ## ### etc)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic (**text** or *text*)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove lists (* or - or 1.)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Clean up multiple spaces and newlines
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
