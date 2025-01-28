import { headers } from 'next/headers'

export async function getRemoveIp() {
  const forwardedFor = headers().get('x-forwarded-for')
  if (!forwardedFor) {
    throw Error('x-forwarded-for header not found')
  }

  return forwardedFor ? forwardedFor.split(',')[0].trim() : ''
}
