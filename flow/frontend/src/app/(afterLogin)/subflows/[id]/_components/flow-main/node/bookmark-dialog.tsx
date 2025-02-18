'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { useNodes } from '@/hooks/xyflow'
import { useUpdateNode } from '@/services/subflow'
import { useSubFlowStore } from '@/store/sub-flow'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog'
import logger from '@/utils/logger'
import { yupResolver } from '@hookform/resolvers/yup'
import { useReactFlow, type AppEdge, type AppNode } from '@xyflow/react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

const schema = Yup.object().shape({
  name: Yup.string().required('Name을 입력해주세요'),
})

export default function BookmarkDialog() {
  const [bookmarkNodeId, setBookmarkNodeId] = useSubFlowStore((state) => [
    state.bookmarkNodeId,
    state.setBookmarkNodeId,
  ])
  const { getNode } = useReactFlow<AppNode, AppEdge>()
  const { setBookmark } = useNodes()
  const { mutateAsync: updateNodeMutate } = useUpdateNode()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: yupResolver(schema),
  })

  const handleClose = () => {
    setBookmarkNodeId(undefined)
    reset()
  }

  const onSubmit = async (data: { name: string }) => {
    const node = getNode(bookmarkNodeId!)
    reset()
    setBookmarkNodeId(undefined)

    if (!node) {
      return
    }

    try {
      await updateNodeMutate({
        nodeId: node.data.databaseId!,
        node: {
          ...node,
          data: {
            ...node.data,
            bookmark: data.name,
          },
        },
      })
      setBookmark(node.id, data.name)
    } catch (error) {
      logger.error(error)
    }
  }

  return (
    <Dialog open={Boolean(bookmarkNodeId)} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span>Bookmark</span>
          </DialogTitle>
          <DialogDescription>{bookmarkNodeId}</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <FormInput control={control} name="name" />
          {errors.name && (
            <span className="error-msg">{errors.name.message}</span>
          )}
          <DialogFooter>
            <Button variant="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">OK</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
