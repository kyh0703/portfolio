'use client'

type HighlightTextProps = {
  text: string
  search: string
  useMatchCase: boolean
  replace?: string
}

export default function HighlightText({
  text,
  search,
  useMatchCase,
  replace,
}: HighlightTextProps) {
  const [propertyName, origin] = text.split(' / ')

  if (!search) {
    return <span><span className='opacity-60'>{propertyName}:</span> {origin}</span>
  }

  const regex = new RegExp(`(${search})`, useMatchCase ? 'g' : 'gi')
  const splitOriginArray = origin.split(regex)

  const renderSplitText = (split: string, index: number) => {
    const isMatch = useMatchCase
      ? split === search
      : split.toLowerCase() === search.toLowerCase()

    if (isMatch) {
      return replace ? (
        <span key={index} className='text-emerald-700 dark:text-emerald-200'>
          <span className="font-bold line-through">{split}</span>
          <mark>{replace}</mark>
        </span>
      ) : (
        <b key={index}>{split}</b>
      )
    }
    return <span key={index}>{split}</span>
  }

  return (
    <>
      <span className='opacity-60'>{propertyName}: </span>
      {splitOriginArray.map(renderSplitText)}
    </>
  )
}