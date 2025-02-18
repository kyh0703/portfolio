'use client'

import { Input } from '@/app/_components/input'
import {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import { FlowTreeData } from '@/models/subflow-list'
import { validateVarDefine } from '@/utils'
import { FocusEventHandler } from 'react'
import { NodeApi, TreeApi } from 'react-arborist'
import { toast } from 'react-toastify'

type NodeInputProps = {
  node?: NodeApi<FlowTreeData>
  tree?: TreeApi<FlowTreeData>
}

export default function NodeInput({ node, tree }: NodeInputProps) {
  if (!node || !tree) {
    return null
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    if (!node.data.isCreated) {
      node.reset()
      return
    }

    const name = event.currentTarget.value
    if (!name) {
      tree.delete(node.id)
      return
    }

    node.submit(name)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation()
    switch (event.key) {
      case 'Escape':
        if (node.data.isCreated) {
          tree.delete(node.id)
        } else {
          node.reset()
        }
        break
      case 'Enter':
        const name = event.currentTarget.value

        const isValidVariableName = REG_EX_VARIABLE_NAME.test(name)
        if (!isValidVariableName) {
          toast.warn(ERROR_VARIABLE_NAME_MESSAGE)
          break
        }

        if (node.data.type === 'file') {
          const isValidVarDefine = validateVarDefine(name)
          if (!isValidVarDefine) {
            toast.warn(ERROR_DEFINE_VARIABLE_NAME_MESSAGE)
            break
          }
        }

        node.submit(name)
        break
    }
  }
  return (
    <Input
      className="ml-2 h-5 w-full grow px-1 text-text focus-visible:rounded-[1px] focus-visible:outline-none focus-visible:ring-offset-0 active:outline-none"
      type="text"
      defaultValue={node.data.name}
      autoFocus
      onFocus={(e) => e.currentTarget.select()}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  )
}
