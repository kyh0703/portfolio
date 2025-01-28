import { KeyValuePair, ResolvableTo } from 'tailwindcss/types/config'

export const letterSpacings: ResolvableTo<KeyValuePair<string, string>> = {
  xs: '0.06px',
  sm: '0.07px',
  md: '0.08px',
  mm: '0.09px',
  lg: '0.1px',
}
