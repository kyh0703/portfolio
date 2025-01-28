function easeInOutSin(time: number) {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2
}

export function animate(
  property: string | number,
  element: { [x: string]: any },
  to: number,
  options: any = {},
  cb: any = () => {},
) {
  const {
    ease = easeInOutSin,
    duration = 300, // standard
  } = options
  let start: number | null = null
  const from = element[property]

  let cancelled = false

  const cancel = () => {
    cancelled = true
  }

  const step = (timestamp: number) => {
    if (cancelled) {
      cb(new Error('Animation cancelled'))
      return
    }

    if (start === null) {
      start = timestamp
    }

    const time = Math.min(1, (timestamp - start) / duration)
    element[property] = ease(time) * (to - from) + from

    if (time >= 1) {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(() => {
        cb(null)
      })
      return
    }

    // eslint-disable-next-line no-undef
    requestAnimationFrame(step)
  }

  if (from === to) {
    cb(new Error('Element already at target position'))
    return cancel
  }
  // eslint-disable-next-line no-undef
  requestAnimationFrame(step)
  return cancel
}

export const debounce = (
  func: { apply: (arg0: any, arg1: any[]) => void },
  wait = 166,
) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: any[]) => {
    const later = () => {
      func.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  debounced.clear = () => {
    clearTimeout(timeout)
  }

  return debounced
}

export function ownerDocument(node: Node | null | undefined): Document {
  return (node && node.ownerDocument) || document
}

export function ownerWindow(node: any) {
  const doc = ownerDocument(node)
  return (doc && doc.defaultView) || window
}
