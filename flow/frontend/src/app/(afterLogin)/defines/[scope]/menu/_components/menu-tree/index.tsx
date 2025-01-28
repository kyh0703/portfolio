'use client'

import { Button } from '@/app/_components/button'
import ConfirmModal from '@/app/_components/confirm-modal'
import { Modal } from '@/app/_components/modal'
import type { MenuCheckOption } from '@/models/define'
import type { MenuTreeData } from '@/models/menu'
import {
  getClipboard,
  getMenu,
  menuKeys,
  useAddClipboard,
  useAddMenu,
  useQueryMenuOption,
  useQueryMenuTree,
  useRemoveMenu,
  useUpdateMenu,
  useUpdateMenuOption,
  useUpdateMenuTree,
} from '@/services/menu'
import { useAddCutPaste } from '@/services/menu/mutations/use-add-cut-paste'
import { useAddReplicate } from '@/services/menu/mutations/use-add-replicate'
import { useUserContext } from '@/store/context'
import { useModalStore } from '@/store/modal'
import type { DefineScope } from '@/types/define'
import { Separator } from '@/ui/separator'
import logger from '@/utils/logger'
import { convertMenuTree, convertMenuTreeData } from '@/utils/tree'
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { Tree, TreeApi, type NodeApi } from 'react-arborist'
import useResizeObserver from 'use-resize-observer'
import { useTree } from '../../_lib/use-tree'
import MenuForm from '../menu-form'
import { defaultValues } from '../menu-form/constants'
import MenuOptionModal from '../menu-option-modal'
import Node from './node'

type MenuTreeProps = {
  scope: DefineScope
  rootId: number
}

export default function MenuTree({ scope, rootId }: MenuTreeProps) {
  const router = useRouter()
  const treeRef = useRef<TreeApi<MenuTreeData> | null>(null)

  const { localIp } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)
  const { ref, width, height } = useResizeObserver<HTMLDivElement>()
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>(
    rootId ? rootId : undefined,
  )
  const { menuTree, checkOption } = useSuspenseQueries({
    queries: [useQueryMenuTree(rootId), useQueryMenuOption(rootId)],
    combine: (results) => ({
      menuTree: results[0].data,
      checkOption: results[1].data,
    }),
  })

  const queryClient = useQueryClient()
  const { mutateAsync: addMenuMutate } = useAddMenu()
  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const { mutateAsync: addReplicateMenuMutate } = useAddReplicate()
  const { mutateAsync: addCutPasteMenuMutate } = useAddCutPaste()
  const { mutateAsync: updateMenuMutate } = useUpdateMenu()
  const { mutateAsync: updateMenuTreeMutate } = useUpdateMenuTree()
  const { mutateAsync: removeMenuMutate } = useRemoveMenu()
  const { mutateAsync: updateMenuOptionMutate } = useUpdateMenuOption()

  const menuTreeData = useMemo(() => {
    return convertMenuTreeData(menuTree)
  }, [menuTree])

  const {
    data: treeData,
    attachTree,
    onCreate,
    onDelete,
    onMove,
    onRename,
    onKeyDown,
  } = useTree<MenuTreeData>(menuTreeData, treeRef.current, {
    onTreeChange: async (tree: MenuTreeData[]) => {
      await updateMenuTreeMutate({
        menuId: rootId,
        tree: convertMenuTree(tree),
      })
    },
    onBeforeCreate: async (args) => {
      const response = await addMenuMutate({
        menu: {
          ...defaultValues,
          name: args.name,
          rootId,
          parentId: args.parentId ? args.parentId : 0,
          capMent: {
            ...defaultValues.capMent,
            tracking:
              checkOption.tracking?.check || checkOption.tracking?.ment.caption,
          },
          choiceMent: {
            ...defaultValues.choiceMent,
            tracking:
              checkOption.tracking?.check || checkOption.tracking?.ment.choice,
          },
          menuOpt: {
            ...defaultValues.menuOpt,
            errorInfo: {
              ...defaultValues.menuOpt.errorInfo!,
              tracking:
                checkOption.tracking?.check ||
                checkOption.tracking?.ment.digitError.check ||
                (checkOption.tracking?.ment.digitError.errorMent.timeout &&
                  checkOption.tracking?.ment.digitError.errorMent.input &&
                  checkOption.tracking?.ment.digitError.errorMent.retry) ||
                false,
              timeout: {
                ...defaultValues.menuOpt.errorInfo!.timeout!,
                tracking:
                  checkOption.tracking?.check ||
                  checkOption.tracking?.ment.digitError.check ||
                  checkOption.tracking?.ment.digitError.errorMent.timeout ||
                  false,
              },
              input: {
                ...defaultValues.menuOpt.errorInfo!.input!,
                tracking:
                  checkOption.tracking?.check ||
                  checkOption.tracking?.ment.vrError.check ||
                  checkOption.tracking?.ment.vrError.errorMent.input ||
                  false,
              },
              retry: {
                ...defaultValues.menuOpt.errorInfo!.retry!,
                tracking:
                  checkOption.tracking?.check ||
                  checkOption.tracking?.ment.vrError.check ||
                  checkOption.tracking?.ment.vrError.errorMent.retry ||
                  false,
              },
            },
          },
          vrAct: {
            ...defaultValues.vrAct,
            errorInfo: {
              ...defaultValues.vrAct?.errorInfo!,
              tracking:
                checkOption.tracking?.check ||
                checkOption.tracking?.ment.vrError.check ||
                (checkOption.tracking?.ment.vrError.errorMent.timeout &&
                  checkOption.tracking?.ment.vrError.errorMent.input &&
                  checkOption.tracking?.ment.vrError.errorMent.retry) ||
                false,
              timeout: {
                ...defaultValues.vrAct?.errorInfo!.timeout!,
                tracking:
                  checkOption.tracking?.check ||
                  checkOption.tracking?.ment.vrError.check ||
                  checkOption.tracking?.ment.vrError.errorMent.timeout ||
                  false,
              },
              input: {
                ...defaultValues.vrAct?.errorInfo!.input!,
                tracking:
                  checkOption.tracking?.check ||
                  checkOption.tracking?.ment.vrError.check ||
                  checkOption.tracking?.ment.vrError.errorMent.input ||
                  false,
              },
              retry: {
                ...defaultValues.vrAct?.errorInfo!.retry!,
                tracking:
                  checkOption.tracking?.check ||
                  checkOption.tracking?.ment.vrError.check ||
                  checkOption.tracking?.ment.vrError.errorMent.retry ||
                  false,
              },
            },
          },
        },
      })
      return { id: '' + response.menuId }
    },
    onBeforeRename: async (args) => {
      const response = await getMenu(args.node.data.databaseId)
      if (!response) {
        return
      }
      await updateMenuMutate({
        menuId: args.node.data.databaseId,
        menu: {
          ...response.property,
          name: args.name,
        },
      })
    },
    onKeyDown: async (event) => {
      switch (event.key) {
        case 'x':
          if (event.ctrlKey || event.metaKey) {
            const focusedNode = treeRef.current?.focusedNode
            if (!focusedNode) {
              return
            }
            openModal('confirm-modal', 'cut')
          }
          break
        case 'c':
          if (event.ctrlKey || event.metaKey) {
            const focusedNode = treeRef.current?.focusedNode
            if (!focusedNode) {
              return
            }
            logger.debug('focusedNode', focusedNode)
            await addClipboardMutate({
              data: {
                ip: localIp,
                type: 'copy',
                rootId,
                menus: [{ id: focusedNode.data.databaseId }],
              },
            })
          }
          break
        case 'v':
          if (event.ctrlKey || event.metaKey) {
            const focusedNode = treeRef.current?.focusedNode
            if (!focusedNode) {
              return
            }
            const clipboard = await getClipboard(localIp)
            if (!clipboard) {
              return
            }
            if (clipboard.menus.length === 0) {
              return
            }
            let response = []
            if (clipboard.type === 'cut') {
              response = await addCutPasteMenuMutate({
                localIp,
                target: {
                  parentId: focusedNode.data.databaseId,
                  rootId,
                },
              })
            } else {
              response = await addReplicateMenuMutate({
                menuId: clipboard.menus[0].id,
                target: { parentId: focusedNode.data.databaseId, rootId },
              })
              const menuTreeData = convertMenuTreeData(response)
              attachTree(focusedNode.id, menuTreeData)
              await updateMenuTreeMutate({
                menuId: rootId,
                tree: convertMenuTree(treeData!),
              })
            }
          }
          break
        case 'Delete': {
          const focusedNode = treeRef.current?.focusedNode
          if (focusedNode?.level !== 0) {
            openModal('confirm-modal', 'delete')
          }
          break
        }
        case 'Enter': {
          const focusedNode = treeRef.current?.focusedNode
          if (focusedNode) {
            setSelectedMenuId(focusedNode.data.databaseId)
          }
        }
      }
    },
  })

  const handleConfirm = async (data: string) => {
    const focusedNode = treeRef.current?.focusedNode
    if (!focusedNode) {
      return
    }
    try {
      if (data === 'cut') {
        await addClipboardMutate({
          data: {
            ip: localIp,
            type: 'cut',
            rootId,
            menus: [{ id: focusedNode.data.databaseId }],
          },
        })
      }
      await removeMenuMutate({
        id: focusedNode.data.databaseId,
      })
      treeRef.current?.delete(focusedNode.id)
      setSelectedMenuId(undefined)
    } catch (error) {
      logger.error(error)
    }
  }

  const handleSubmitOptions = async (options: MenuCheckOption) => {
    await updateMenuOptionMutate({
      menuId: rootId,
      option: options,
    })
    if (selectedMenuId) {
      queryClient.invalidateQueries({
        queryKey: [menuKeys.detail(selectedMenuId)],
      })
    }
  }

  const handleActivate = (node: NodeApi<MenuTreeData>) => {
    setSelectedMenuId(node.data.databaseId)
  }

  return (
    <>
      <Modal id="menu-modal" title="Menu check Options">
        <MenuOptionModal
          checkOption={checkOption}
          onSubmit={handleSubmitOptions}
        />
      </Modal>
      <Modal id="confirm-modal">
        <ConfirmModal
          content="정말 삭제하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between p-6">
          <h2 className="flex-1">Menu definition - Menu Tree</h2>
          <div className="flex gap-14">
            <div>
              <Button
                variant="secondary3"
                size="full"
                onClick={() => openModal('menu-modal', null)}
              >
                Menu Options
              </Button>
            </div>
            <Button variant="secondary2" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex h-full w-full overflow-hidden">
          <div
            ref={ref}
            className="h-full w-80 overflow-auto p-2"
            onKeyDown={onKeyDown}
          >
            <Tree
              ref={treeRef}
              data={treeData}
              width={width}
              height={height}
              indent={24}
              disableEdit
              disableMultiSelection
              rowClassName="focus:outline-none"
              onCreate={onCreate}
              onRename={onRename}
              onDelete={onDelete}
              onMove={onMove}
              onActivate={handleActivate}
            >
              {Node}
            </Tree>
          </div>
          <Separator orientation="vertical" />
          <div className="flex h-full w-full overflow-hidden">
            {selectedMenuId && (
              <MenuForm
                scope={scope}
                checkOption={checkOption}
                rootId={rootId}
                menuId={selectedMenuId}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
