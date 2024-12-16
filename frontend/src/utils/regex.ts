/**
 * 校验手机号是否合法
 * @param phoneNumber 待校验的手机号
 * @returns 是否合法
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phoneNumber)
}
