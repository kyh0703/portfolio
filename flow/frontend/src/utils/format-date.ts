export function formatDateYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatDateTime(text: string) {
  const year = text.substring(0, 4)
  const month = text.substring(4, 6)
  const day = text.substring(6, 8)
  const hour = text.substring(8, 10)
  const minute = text.substring(10, 12)
  const second = text.substring(12, 14)

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
