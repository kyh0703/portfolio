import { format, formatInTimeZone, toZonedTime } from 'date-fns-tz'

function formatKoreanTime(date: Date) {
  return formatInTimeZone(date, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')
}

function formatViewTime(isoString: string) {
  const zonedDate = toZonedTime(isoString, 'UTC')
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ss')
}

export { formatKoreanTime, formatViewTime }
