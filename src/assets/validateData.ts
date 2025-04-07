export const getValidateNumber = (value?: unknown): number => {
  if (typeof value !== 'number' && typeof value !== 'string') return 0
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  const formattedValue = parseFloat(value)

  return Number.isFinite(formattedValue) ? formattedValue : 0
}

export const getValidateString = (value?: unknown): string => {
  if (typeof value !== 'string') return ''
  return value
}

export const getLowerCase = (value: string): string => {
  return value.trim().toLowerCase()
}

export const getValidateBoolean = (value?: unknown): boolean => {
  if (typeof value !== 'boolean') return false
  return value
}

export const getValidateArray = (data?: unknown): unknown[] | [] => {
  if (!Array.isArray(data)) return []
  return data
}

export const getValidateObject = (data?: unknown): Record<string, unknown> => {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data) ||
    Object.prototype.toString.call(data) !== '[object Object]'
  ) {
    return {}
  }

  return data as Record<string, unknown>
}
