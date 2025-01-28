const extractKeyword = (text: string, position: number) => {
  text = text.substring(0, position)
  if (text.at(-1) === ']') {
    return ''
  }

  const delimiterRegex = /[\+\-\*\/\!\&\||\<\>\(\)\,\s\t]/

  const stack = []
  for (let i = text.length - 1; i >= 0; i--) {
    const char = text[i]
    if (char === ']') {
      stack.push(i)
    } else if (char === '[') {
      if (stack.length > 0) {
        stack.pop()
      } else {
        return text.substring(i + 1)
      }
    } else if (stack.length === 0 && delimiterRegex.test(char)) {
      return text.substring(i + 1)
    }
  }
  return text
}

export { extractKeyword }
