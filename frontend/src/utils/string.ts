/**
 * 性别展示
 * @param gender
 */
export const renderGender = (
  gender: string | undefined,
): '他' | '她' | 'TA' => {
  switch (gender) {
    case 'MALE':
      return '他'

    case 'FEMALE':
      return '她'

    default:
      return 'TA'
  }
}

/**
 * 颜色转换为 rgba 格式
 * @param hex
 * @param alpha
 */
export function hexToRgba(hex: string, alpha = 1): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
