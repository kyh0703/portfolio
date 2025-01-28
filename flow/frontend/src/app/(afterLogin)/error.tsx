'use client'

import { CustomError } from '@/services'
import InternalServerError from '../_components/error-page/internal-error'
import UnAuthorizedError from '../_components/error-page/unauthorized-error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (error instanceof CustomError) {
    if (error.status === 401) {
      return <UnAuthorizedError message={error.message} />
    }
  }

  return <InternalServerError message={error.message} />
}
