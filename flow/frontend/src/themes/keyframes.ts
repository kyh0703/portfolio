export const keyframes = {
  'slide-down-and-fade': {
    from: { opacity: '0', transform: 'translateY(-2px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'slide-left-and-fade': {
    from: { opacity: '0', transform: 'translateX(2px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'slide-up-and-fade': {
    from: { opacity: '0', transform: 'translateY(2px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'slide-right-and-fade': {
    from: { opacity: '0', transform: 'translateX(-2px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
}
