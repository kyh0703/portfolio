'use client'

import { cn } from '@/utils'
import React, { type KeyboardEventHandler } from 'react'
import { twJoin } from 'tailwind-merge'
import TabScrollButton from './tab-scroll-button'
import { TabsScroller } from './tabs-scroller'
import { animate, debounce, ownerDocument, ownerWindow } from './utils'

const nextItem = (list: HTMLDivElement | null, item: Element | null) => {
  if (list === item) {
    return list?.firstChild
  }

  if (item && item.nextElementSibling) {
    return item.nextElementSibling
  }

  return list?.firstChild
}

const previousItem = (list: HTMLDivElement | null, item: Element | null) => {
  if (list === item) {
    return list?.lastChild
  }

  if (item && item.previousElementSibling) {
    return item.previousElementSibling
  }

  return list?.lastChild
}

const moveFocus = (
  list: HTMLDivElement | null,
  currentFocus: Element | null,
  traversalFunction: any,
) => {
  let wrappedOnce = false
  let nextFocus = traversalFunction(list, currentFocus)

  while (nextFocus) {
    if (nextFocus === list?.firstChild) {
      if (wrappedOnce) {
        return
      }
    }
    wrappedOnce = true
  }

  const nextFocusDisabled =
    nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true'

  if (!nextFocus.hasAttribute('tabindex') || nextFocusDisabled) {
    nextFocus = traversalFunction(list, nextFocus)
  } else {
    nextFocus.focus()
  }
}

const defaultIndicatorStyle = {}

interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children?: React.ReactNode
  value?: any
  orientation?: 'horizontal' | 'vertical'
  animationDuration?: number
  selectionFollowsFocus?: boolean
  textColor?: 'primary' | 'secondary' | 'inherit'
  action?: any
  centered?: boolean
  hiddenArrowButtons?: boolean
  onChange?: (event: any, value: any) => void
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children: childrenProp,
      value,
      orientation = 'horizontal',
      animationDuration = 300,
      selectionFollowsFocus,
      textColor = 'primary',
      action,
      centered = false,
      hiddenArrowButtons = false,
      onChange,
    },
    ref,
  ) => {
    const vertical = orientation === 'vertical'

    const scrollStart = vertical ? 'scrollTop' : 'scrollLeft'
    const start = vertical ? 'top' : 'left'
    const end = vertical ? 'bottom' : 'right'
    const clientSize = vertical ? 'clientHeight' : 'clientWidth'
    const size = vertical ? 'height' : 'width'

    const [mounted, setMounted] = React.useState(false)
    const [indicatorStyle, setIndicatorStyle] = React.useState<
      Record<string, any>
    >(defaultIndicatorStyle)
    const [displayStartScroll, setDisplayStartScroll] = React.useState(false)
    const [displayEndScroll, setDisplayEndScroll] = React.useState(false)
    const [updateScrollObserver, setUpdateScrollObserver] =
      React.useState(false)

    const [scrolledStyle, setScrolledStyle] = React.useState<{
      overflow: string | undefined
      scrollbarWidth: number
    }>({
      overflow: 'hidden',
      scrollbarWidth: 0,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const valueToIndex = new Map()
    const tabsRef = React.useRef<HTMLDivElement>(null)
    const tabListRef = React.useRef<HTMLDivElement>(null)

    const getTabsMeta = React.useCallback(() => {
      const tabsNode = tabsRef.current
      let tabsMeta: Record<string, any> | null = null
      if (tabsNode) {
        const rect = tabsNode.getBoundingClientRect()
        tabsMeta = {
          clientWidth: tabsNode.clientWidth,
          scrollLeft: tabsNode.scrollLeft,
          scrollTop: tabsNode.scrollTop,
          scrollWidth: tabsNode.scrollWidth,
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        }
      }

      let tabMeta: Record<string, any> | null = null
      if (tabsNode && value !== false) {
        const children = tabListRef.current!.children

        if (children.length > 0) {
          const tab = children[valueToIndex.get(value)]
          tabMeta = tab ? tab.getBoundingClientRect() : null
        }
      }

      return { tabsMeta, tabMeta }
    }, [value, valueToIndex])

    const updateIndicatorState = React.useCallback(() => {
      const { tabsMeta, tabMeta } = getTabsMeta()
      let startValue = 0
      let startIndicator

      if (vertical) {
        startIndicator = 'top'
        if (tabMeta && tabsMeta) {
          startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop
        }
      } else {
        startIndicator = 'left'
        if (tabMeta && tabsMeta) {
          startValue = tabMeta.left - tabsMeta.left + tabsMeta.scrollLeft
        }
      }

      const newIndicatorStyle = {
        [startIndicator]: startValue,
        [size]: tabMeta ? tabMeta[size] : 0,
      }

      if (
        typeof indicatorStyle[startIndicator] !== 'number' ||
        typeof indicatorStyle[size] !== 'number'
      ) {
        setIndicatorStyle(newIndicatorStyle)
      } else {
        const dStart = Math.abs(
          indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator],
        )
        const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size])

        if (dStart >= 1 || dSize >= 1) {
          setIndicatorStyle(newIndicatorStyle)
        }
      }
    }, [getTabsMeta, indicatorStyle, size, vertical])

    const scroll = React.useCallback(
      (scrollValue: number, { animation = true } = {}) => {
        if (animation) {
          animate(scrollStart, tabsRef.current!, scrollValue, {
            duration: animationDuration,
          })
        } else {
          tabsRef.current![scrollStart] = scrollValue
        }
      },
      [animationDuration, scrollStart],
    )

    const moveTabsScroll = (delta: any) => {
      let scrollValue = tabsRef.current![scrollStart]
      scrollValue += delta
      scroll(scrollValue)
    }

    const getScrollSize = () => {
      const containerSize = tabsRef.current![clientSize]
      let totalSize = 0
      const children = Array.from(tabListRef.current!.children)

      for (let i = 0; i < children.length; i++) {
        const tab = children[i]
        if (totalSize + tab[clientSize] > containerSize) {
          if (i === 0) {
            totalSize = containerSize
          }
          break
        }
        totalSize += tab[clientSize]
      }

      return totalSize
    }

    const handleStartScrollClick = () => {
      moveTabsScroll(-1 * getScrollSize())
    }

    const handleEndScrollClick = () => {
      moveTabsScroll(getScrollSize())
    }

    const getNavigationButtons = () => {
      const elements: Record<string, React.ReactNode | null> = {}

      elements.scrollButtonStart = (
        <TabScrollButton
          className={cn(displayStartScroll ? 'visible px-1' : 'invisible')}
          direction="left"
          disabled={!displayStartScroll}
          onClick={handleStartScrollClick}
        />
      )

      elements.scrollButtonEnd = displayEndScroll ? (
        <TabScrollButton
          className="px-1"
          direction="right"
          disabled={!displayEndScroll}
          onClick={handleEndScrollClick}
        />
      ) : null

      return elements
    }

    const updateScrollButtonState = React.useCallback(() => {
      setUpdateScrollObserver(!updateScrollObserver)
    }, [updateScrollObserver])

    React.useEffect(() => {
      const handleResize = debounce(() => {
        // If the Tabs component is replaced by Suspense with a fallback, the last
        // ResizeObserver's handler that runs because of the change in the layout is trying to
        // access a dom node that is no longer there (as the fallback component is being shown instead).
        // See https://github.com/mui/material-ui/issues/33276
        // TODO: Add tests that will ensure the component is not failing when
        // replaced by Suspense with a fallback, once React is updated to version 18
        if (tabsRef.current) {
          updateIndicatorState()
        }
      })

      let resizeObserver: any

      /**
       * @type {MutationCallback}
       */
      const handleMutation = (records: any) => {
        records.forEach((record: any) => {
          record.removedNodes.forEach((item: any) => {
            resizeObserver?.unobserve(item)
          })
          record.addedNodes.forEach((item: any) => {
            resizeObserver?.observe(item)
          })
        })
        handleResize()
        updateScrollButtonState()
      }

      const win = ownerWindow(tabsRef.current)
      win.addEventListener('resize', handleResize)

      let mutationObserver: any

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(handleResize)
        Array.from(tabListRef.current!.children).forEach((child) => {
          resizeObserver.observe(child)
        })
      }

      if (typeof MutationObserver !== 'undefined') {
        mutationObserver = new MutationObserver(handleMutation)
        mutationObserver.observe(tabListRef.current, {
          childList: true,
        })
      }

      return () => {
        handleResize.clear()
        win.removeEventListener('resize', handleResize)
        mutationObserver?.disconnect()
        resizeObserver?.disconnect()
      }
    }, [updateIndicatorState, updateScrollButtonState])

    /**
     * Toggle visibility of start and end scroll buttons
     * Using IntersectionObserver on first and last Tabs.
     */
    React.useEffect(() => {
      const tabListChildren = Array.from(tabListRef.current!.children)
      const length = tabListChildren.length

      if (typeof IntersectionObserver !== 'undefined' && length > 0) {
        const observerOptions = { root: tabsRef.current, threshold: 0.99 }

        const handleScrollButtonStart = (entries: any) => {
          setDisplayStartScroll(!entries[0].isIntersecting)
        }
        const firstObserver = new IntersectionObserver(
          handleScrollButtonStart,
          observerOptions,
        )
        firstObserver.observe(tabListChildren[0])

        const handleScrollButtonEnd = (entries: any) => {
          setDisplayEndScroll(!entries[0].isIntersecting)
        }
        const lastObserver = new IntersectionObserver(
          handleScrollButtonEnd,
          observerOptions,
        )
        lastObserver.observe(tabListChildren[length - 1])

        return () => {
          firstObserver.disconnect()
          lastObserver.disconnect()
        }
      }

      return undefined
    }, [updateScrollObserver, childrenProp])

    React.useEffect(() => {
      setMounted(true)
    }, [])

    React.useEffect(() => {
      updateIndicatorState()
    })

    React.useEffect(() => {
      const scrollSelectedIntoView = (animation: boolean) => {
        const { tabsMeta, tabMeta } = getTabsMeta()
        if (!tabsMeta || !tabMeta) {
          return
        }

        if (tabMeta[start] < tabsMeta[start]) {
          const nextScrollStart =
            tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start])
          scroll(nextScrollStart, { animation })
        } else if (tabMeta[end] > tabsMeta[end]) {
          const nextScrollStart =
            tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end])
          scroll(nextScrollStart, { animation })
        }
      }

      // Don't animate on the first render.
      scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end, indicatorStyle, scroll, scrollStart, start])

    React.useImperativeHandle(
      action,
      () => ({
        updateIndicator: updateIndicatorState,
        updateScrollButtons: updateScrollButtonState,
      }),
      [updateIndicatorState, updateScrollButtonState],
    )

    const indicator = (
      <span
        className={cn(
          'absolute bottom-0 h-[2px] w-full bg-primary',
          orientation === 'vertical' && 'right-0 h-full w-[2px]',
        )}
        style={{
          ...indicatorStyle,
        }}
      />
    )

    let childIndex = 0
    const children = React.Children.map(childrenProp, (child) => {
      if (!React.isValidElement(child)) {
        return null
      }

      const childValue =
        child.props.value === undefined ? childIndex : child.props.value
      valueToIndex.set(childValue, childIndex)
      const selected = childValue === value

      childIndex += 1
      return React.cloneElement(child, {
        indicator: selected && !mounted && indicator,
        selected,
        selectionFollowsFocus,
        textColor,
        value: childValue,
        onChange,
        ...(childIndex === 1 && value === false && !child.props.tabIndex
          ? { tabIndex: 0 }
          : {}),
      } as any)
    })

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
      const list = tabListRef.current
      const currentFocus = ownerDocument(list).activeElement

      const role = currentFocus?.getAttribute('role')
      if (role !== 'tab') {
        return
      }

      let previousItemKey =
        orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
      let nextItemKey =
        orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

      switch (event.key) {
        case previousItemKey:
          event.preventDefault()
          moveFocus(list, currentFocus, previousItem)
          break
        case nextItemKey:
          event.preventDefault()
          moveFocus(list, currentFocus, nextItem)
          break
        case 'Home':
          event.preventDefault()
          moveFocus(list, null, nextItem)
          break
        case 'End':
          event.preventDefault()
          moveFocus(list, null, previousItem)
          break
        default:
          break
      }
    }

    const navButtons = getNavigationButtons()

    return (
      <div ref={ref} className="flex min-h-[48px] overflow-auto">
        {hiddenArrowButtons || navButtons.scrollButtonStart}
        <TabsScroller
          ref={tabsRef}
          style={{ overflow: scrolledStyle.overflow }}
        >
          <div
            ref={tabListRef}
            className={twJoin(
              'flex',
              centered && 'justify-center',
              orientation === 'vertical' && 'flex-col',
            )}
            role="tablist"
            onKeyDown={handleKeyDown}
          >
            {children}
          </div>
          {mounted && indicator}
        </TabsScroller>
        {hiddenArrowButtons || navButtons.scrollButtonEnd}
      </div>
    )
  },
)

Tabs.displayName = 'Tabs'
