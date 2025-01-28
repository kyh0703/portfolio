import { fetchExtended } from '@/services/lib/fetch'

export const downloadFile = async (fileName: string) => {
  const response = await fetchExtended<Blob>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/admins/download/${fileName}`,
    {
      method: 'POST',
    },
  )

  return response.body
}
