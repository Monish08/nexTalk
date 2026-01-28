import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function calculateScore(upvotes: number, downvotes: number, createdAt: Date): number {
  const totalVotes = upvotes - downvotes
  const hoursSinceCreation = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
  
  // Reddit's hot ranking algorithm (simplified)
  const sign = totalVotes > 0 ? 1 : totalVotes < 0 ? -1 : 0
  const order = Math.log10(Math.max(Math.abs(totalVotes), 1))
  const decay = hoursSinceCreation / 12 // Decay factor
  
  return sign * order - decay
}

export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const plainText = markdown
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\n/g, ' ')
    .trim()
  
  return truncateText(plainText, maxLength)
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(parsedUrl.pathname)
  } catch {
    return false
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
