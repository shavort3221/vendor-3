import { format, formatDistanceToNow } from 'date-fns'

// Date formatting helpers
export const formatDate = (date: string | Date, formatString: string = 'dd/MM/yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    return 'Invalid date'
  }
}

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export const formatRelativeTime = (date: string | Date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    return 'Invalid date'
  }
}

// Currency formatting
export const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatCompactCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount)
}

// String helpers
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str: string, length: number) => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Array helpers
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item)
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

export const isValidGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstRegex.test(gst)
}

export const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode)
}

// Number helpers
export const roundToDecimals = (num: number, decimals: number = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return roundToDecimals((value / total) * 100, 2)
}

export const calculateDiscount = (originalPrice: number, discountPercentage: number): number => {
  return roundToDecimals(originalPrice * (discountPercentage / 100), 2)
}

export const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number): number => {
  const discount = calculateDiscount(originalPrice, discountPercentage)
  return roundToDecimals(originalPrice - discount, 2)
}

// Status helpers
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

export const getStatusIcon = (status: string): string => {
  const statusIcons: Record<string, string> = {
    pending: '⏳',
    confirmed: '✅',
    shipped: '🚚',
    delivered: '📦',
    cancelled: '❌',
    success: '✅',
    failed: '❌',
    active: '🟢',
    inactive: '⚫'
  }
  return statusIcons[status.toLowerCase()] || '❓'
}

// File helpers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// URL helpers
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

export const parseQueryString = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(queryString)
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

// Debounce helper
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle helper
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Local storage helpers
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue || null
  } catch (error) {
    console.error('Error getting localStorage:', error)
    return defaultValue || null
  }
}

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing localStorage:', error)
  }
}

// Session storage helpers
export const setSessionStorage = (key: string, value: any): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting sessionStorage:', error)
  }
}

export const getSessionStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue || null
  } catch (error) {
    console.error('Error getting sessionStorage:', error)
    return defaultValue || null
  }
}

export const removeSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing sessionStorage:', error)
  }
}
