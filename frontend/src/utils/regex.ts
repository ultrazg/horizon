/**
 * 校验手机号是否合法
 * @param phoneNumber 待校验的手机号
 * @returns 是否合法
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phoneNumber)
}

/**
 * 校验ip是否合法
 * @param ip 待校验的ip
 * @returns 是否合法
 */
export const isValidIp = (ip: string): boolean => {
  return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip,
  )
}
