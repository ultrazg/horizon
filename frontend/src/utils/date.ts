import dayjs from 'dayjs'

const DAY_LABELS = [
  '今日内',
  '一天前',
  '两天前',
  '三天前',
  '四天前',
  '五天前',
  '六天前',
  '七天前',
]

/**
 * 将时间格式化为相对描述
 * - 当天显示「今日」
 * - 1~7 天内显示「一天前」~「七天前」
 * - 超出 7 天显示 YYYY/MM/DD
 * @param time dayjs 可解析的时间（Date、时间戳、ISO 字符串等）
 */
export function formatRelativeDate(time: dayjs.ConfigType): string {
  const target = dayjs(time)
  if (!target.isValid()) return '--'

  const diff = dayjs().startOf('day').diff(target.startOf('day'), 'day')

  if (diff < 0 || diff > 7) return target.format('YYYY/MM/DD')

  return DAY_LABELS[diff]
}
