import { useMemo } from 'react'

interface FormattedIntervalProps {
  startDatetime: Date | string
  endDatetime: Date | string
  locale?: string
  hideCurrentYear?: boolean
}

const FormattedInterval: React.FC<FormattedIntervalProps> = ({
  startDatetime,
  endDatetime,
  locale = 'en-US',
  hideCurrentYear = true,
}) => {
  const formatted = useMemo(() => {
    const startDate = new Date(startDatetime)
    const endDate = new Date(endDatetime)
    const currentYear = new Date().getFullYear()

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear()
    const startMonth = startDate.getMonth()
    const endMonth = endDate.getMonth()

    const separator = '–'

    const shouldHideYear =
      hideCurrentYear && endYear === currentYear && startYear === endYear

    if (startYear === endYear && startMonth === endMonth) {
      const monthYear = endDate.toLocaleDateString(locale, {
        month: 'short',
        ...(shouldHideYear ? {} : { year: 'numeric' }),
      })
      const startDay = startDate.getDate()
      const endDay = endDate.getDate()
      return `${monthYear} ${startDay} ${separator} ${endDay}`
    }

    if (startYear === endYear) {
      const startFormatted = startDate.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
      })
      const endFormatted = endDate.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        ...(shouldHideYear ? {} : { year: 'numeric' }),
      })
      return `${startFormatted} ${separator} ${endFormatted}`
    }

    const startFormatted = startDate.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const endFormatted = endDate.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return `${startFormatted} ${separator} ${endFormatted}`
  }, [startDatetime, endDatetime, locale, hideCurrentYear])

  return <>{formatted}</>
}

export default FormattedInterval
