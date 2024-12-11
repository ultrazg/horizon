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
