import AuthRedirect from './_components/auth-redirect'
import { getRemoveIp } from './_lib/get-remote-ip'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const localIp = await getRemoveIp()
  const accessToken = searchParams?.access as string | undefined
  const refreshToken = searchParams?.refresh as string | undefined
  if (!accessToken || !refreshToken) {
    throw new Error('token not found')
  }

  return (
    <AuthRedirect
      localIp={localIp}
      accessToken={accessToken}
      refreshToken={refreshToken}
    />
  )
}
