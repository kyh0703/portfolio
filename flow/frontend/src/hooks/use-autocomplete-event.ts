import { useCallback, useEffect } from 'react'

const useAutocompleteEvent = (
  isListOpen: boolean,
  inputRef?: React.RefObject<HTMLDivElement>,
  listRef?: React.RefObject<HTMLDivElement>,
  setOptionType?: React.Dispatch<React.SetStateAction<any>>,
  setIsListOpen?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        !inputRef?.current?.contains(event.target as Node) &&
        !listRef?.current?.contains(event.target as Node)
      ) {
        setOptionType && setOptionType(null)
        setIsListOpen && setIsListOpen(false)
      }
    },
    [setIsListOpen, setOptionType, inputRef, listRef],
  )

  useEffect(() => {
    if (isListOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handleClickOutside, isListOpen])

  useEffect(() => {
    const close = () => {
      setOptionType && setOptionType(null)
      setIsListOpen && setIsListOpen(false)
    }
    window.addEventListener('blur', close)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('blur', close)
      window.removeEventListener('resize', close)
    }
  }, [setIsListOpen, setOptionType])
}

export default useAutocompleteEvent
