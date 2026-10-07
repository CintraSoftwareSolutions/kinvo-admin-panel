export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validateEmail(value: string) {
  if (!value.trim()) {
    return 'Email is required'
  }

  if (!isValidEmail(value)) {
    return 'Enter a valid email address'
  }

  return ''
}

export function validateRequiredPassword(value: string) {
  if (!value) {
    return 'Password is required'
  }

  return ''
}

export function validateNewPassword(value: string) {
  if (!value) {
    return 'Password is required'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters'
  }

  return ''
}
