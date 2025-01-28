import { ParamList } from '@/models/property/iweb'

export default function useParseDocument() {
  const extractIwebData = (str: string) => {
    const regex = /<[^>]*iweb-data[^>]*>/g
    return str.match(regex)
  }

  function classifyIwebData(str: RegExpMatchArray) {
    const inArray: Array<string> = []
    const outArray: Array<string> = []
    const regex = /iweb-data="([^"]*)"/

    str.forEach((text) => {
      const objectIdMatch = text.match(regex)!
      switch (objectIdMatch[1]) {
        case 'in':
          inArray.push(text)
          break
        case 'out':
          outArray.push(text)
          break
        case 'inout':
          inArray.push(text)
          outArray.push(text)
          break
      }
    })
    return [inArray, outArray]
  }

  const mapObjectIdArray = (str: string) => {
    // objectId 값을 추출하는 정규표현식
    const objectIdRegex = /id="([^"]*)"/
    const objectIdMatch = str.match(objectIdRegex)
    const objectId = objectIdMatch ? objectIdMatch[1] : ''
    return objectId
  }

  const mapObjectIdTypeValueArray = (str: string) => {
    // objectId 값을 추출하는 정규표현식
    const objectIdRegex = /id="([^"]*)"/
    const objectIdMatch = str.match(objectIdRegex)
    const objectId = objectIdMatch ? objectIdMatch[1] : ''

    // value 값을 추출하는 정규표현식
    const valueRegex = /value="([^"]*)"/
    const valueMatch = str.match(valueRegex)
    const value = valueMatch ? valueMatch[1] : ''

    // type 값을 추출하는 정규표현식
    const typeRegex = /type="([^"]*)"/
    const typeMatch = str.match(typeRegex)
    const type = typeMatch ? typeMatch[1] : ''

    return { objectId, value, type }
  }

  const parseHtmlJsp: (str: string) => {
    parameterList: ParamList[]
    inputObjectList: string[]
  } = (str: string) => {
    // '<'로 시작하고 'iweb-data'를 포함하며 '>'로 끝나는 문자열 추출.
    const iwebDataArray = extractIwebData(str)
    if (!iwebDataArray) return { parameterList: [], inputObjectList: [] }

    // iweb-data="in"인지 "out"인지 "inout"인지에 따라 배열에 분류
    const [inArray, outArray] = classifyIwebData(iwebDataArray)

    // 배열을 순회하며 id, type, value를 추출하여 {objectId, type, value} 형태로 반환
    const parameterList = outArray.map(mapObjectIdTypeValueArray)

    // 배열을 순회하며 id를 추출하여 {objectId} 형태로 반환
    const inputObjectList = inArray.map(mapObjectIdArray)

    return { parameterList, inputObjectList }
  }

  const parseJson: (str: string) => {
    parameterList: ParamList[]
    inputObjectList: string[]
  } = (str: string) => {
    try {
      const json = JSON.parse(str)
      const parameterList = json.meta.input_list.map((item: string) => {
        return { objectId: item, value: '', type: '' }
      })
      return { parameterList, inputObjectList: json.meta.output_list }
    } catch (e) {
      return { parameterList: [], inputObjectList: [] }
    }
  }

  return { parseHtmlJsp, parseJson }
}
