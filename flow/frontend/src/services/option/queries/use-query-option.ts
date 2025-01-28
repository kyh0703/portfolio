import { getOption, optionKeys } from '..'

export const useQueryOption = () => ({
  queryKey: [optionKeys.all],
  queryFn: () => getOption(),
})
