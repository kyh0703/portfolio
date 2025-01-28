import { getToken } from '../api/get-token'
import { tokenKeys } from '../keys'

const useQueryToken = () => ({
  queryKey: [tokenKeys.all],
  queryFn: () => getToken(),
})

export default useQueryToken
