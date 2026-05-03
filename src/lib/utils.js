import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function truncateText(text, maxLength) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getFileType(url) {
  if (!url) return 'unknown'
  const extension = url.split('.').pop().toLowerCase()
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const videoExts = ['mp4', 'webm', 'mov', 'avi']
  const pdfExts = ['pdf']
  
  if (imageExts.includes(extension)) return 'image'
  if (videoExts.includes(extension)) return 'video'
  if (pdfExts.includes(extension)) return 'pdf'
  return 'document'
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}