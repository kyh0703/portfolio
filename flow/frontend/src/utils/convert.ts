import { NextRequest, NextResponse } from 'next/server'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

export async function requestToSnake(request: NextRequest) {
  switch (request.method) {
    case 'POST':
    case 'PUT':
      const data = await request.json()
      const snakeCasedData = snakecaseKeys(data, { deep: true })

      const modifiedRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(snakeCasedData),
      })
      return NextResponse.next({ request: modifiedRequest })
    default:
      return NextResponse.next({ request })
  }
}

export async function responseToCamel(response: NextResponse) {
  const clonedResponse = response.clone()
  const data = await clonedResponse.json()
  const camelCasedData = camelcaseKeys(data, { deep: true })
  return NextResponse.json(camelCasedData, response)
}
