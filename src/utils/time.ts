import dayjs from 'dayjs'

export function extractPeriodFromDates(rawStartDate?: Date, rawEndDate?: Date): string {
  if (!rawStartDate) {
    return ''
  }

  const startDate = dayjs(rawStartDate)
  const endDate = rawEndDate ? dayjs(rawEndDate) : undefined

  const years = endDate ? endDate.diff(startDate, 'years') : dayjs().diff(startDate, 'years')
  const months = endDate ? endDate.diff(startDate, 'months') % 12 : dayjs().diff(startDate, 'months') % 12
  const days = endDate ? endDate.diff(startDate, 'days') % 365 : dayjs().diff(startDate, 'days') % 365

  const timeParts = []
  if (years > 0) {
    timeParts.push(years > 1 ? `${years} years` : `${years} year`)
  }
  if (months > 0) {
    timeParts.push(months > 1 ? `${months} months` : `${months} month`)
  }
  if (years === 0 && months === 0) {
    timeParts.push(days > 1 ? `${days} days` : `${days} day`)
  }

  return timeParts.join(', ')
}
