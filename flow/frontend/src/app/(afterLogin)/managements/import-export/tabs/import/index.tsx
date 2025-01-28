'use client'

import { Button } from '@/app/_components/button'
import { PlusIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import SearchBox from '@/app/_components/search-bar'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import { useImportManage } from '@/services/manage/mutations/use-import-manage'
import { useModalStore } from '@/store/modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { cn } from '@/utils'
import { SelectionChangedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Loader2Icon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import ImportList from './import-list'
import ConfirmModal from './confirm-modal'

export type StatusType = 'idle' | 'success' | 'fail'
export type ImportType = {
  file: File
  status: StatusType
  reason: string
}

export default function ImportTab() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)
  const gridRef = useRef<AgGridReact<ImportType>>(null)

  const { onFilterChanged } = useGridHook<ImportType>(gridRef)

  const [isEnableImportButton, setIsEnableImportButton] =
    useState<boolean>(false)
  const [imports, setImports] = useState<ImportType[]>([])
  const [checkedRowsData, setCheckedRowsData] = useState<ImportType[]>([])

  const openModal = useModalStore((state) => state.openModal)
  const { mutateAsync: importMutation, isPending } = useImportManage()

  const handleUploadFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleUploadFolder = useCallback(() => {
    folderInputRef.current?.click()
  }, [])

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChanged('quickFilterText', e.target.value.toLocaleLowerCase())
    },
    [onFilterChanged],
  )

  // .json을 제거해 파일명만 추출
  const nameWithoutExtension = useCallback(
    (text: string) => text.split('.').slice(0, -1).join('.'),
    [],
  )

  // 파일명이 main이거나 end이면 import 대상에서 제외
  const isMainOrEnd = useCallback(
    (text: string) => ['main', 'end'].includes(text.toLocaleLowerCase()),
    [],
  )

  const handleChangeFile = useCallback(() => {
    if (!fileInputRef.current?.files) return

    const files = [...fileInputRef.current.files]
      .filter(
        (file) =>
          file.name.includes('json') &&
          !isMainOrEnd(nameWithoutExtension(file.name)),
      )
      .map((file) => ({ file, status: 'idle' as StatusType, reason: '' }))

    setImports(files)
  }, [isMainOrEnd, nameWithoutExtension])

  const handleChangeFolder = useCallback(() => {
    if (!folderInputRef.current?.files) return

    const files = [...folderInputRef.current.files]
      .filter(
        (file) =>
          file.name.includes('json') &&
          !isMainOrEnd(nameWithoutExtension(file.name)),
      )
      .map((file) => ({ file, status: 'idle' as StatusType, reason: '' }))

    setImports(files)
  }, [isMainOrEnd, nameWithoutExtension])

  const handleSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows()
    setCheckedRowsData(selectedRows)
    setIsEnableImportButton(selectedRows.length > 0)
  }, [])

  const handleClickImport = useCallback(() => {
    const formData = new FormData()

    checkedRowsData.forEach(({ file }) => {
      formData.append('file', file)
    })

    importMutation(formData, {
      onSuccess: ({ failInfo }) => {
        const api = gridRef.current?.api
        if (!api) {
          return
        }

        api.forEachNode((node) => {
          const gridRowData = node.data!.file

          const isChecked = checkedRowsData.some(
            (item) => item.file.name === gridRowData.name,
          )

          if (isChecked) {
            node.setSelected(true)

            const failedFile = failInfo.find(
              (item) => item.name === nameWithoutExtension(gridRowData.name),
            )

            if (failedFile) {
              node.setData({
                file: gridRowData,
                status: 'fail',
                reason: failedFile.msg,
              })
            } else {
              node.setData({
                file: gridRowData,
                status: 'success',
                reason: '',
              })
            }
          }
        })
      },
    })
  }, [importMutation, nameWithoutExtension, checkedRowsData])

  return (
    <div className="flex h-full w-full flex-col p-6">
      <Modal id="confirm-modal">
        <ConfirmModal onSubmit={handleClickImport} />
      </Modal>
      <div className="mb-3 flex items-center justify-between gap-6">
        <div className="w-[358px]">
          <SearchBox placeHolder="Search..." onChange={handleChangeSearch} />
        </div>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary2">
                <PlusIcon />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleUploadFile}>
                File Add
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUploadFolder}>
                Folder Add
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            multiple
            onChange={handleChangeFile}
          />
          <input
            ref={(node) => {
              folderInputRef.current = node
              if (node) {
                node.setAttribute('webkitdirectory', '')
                node.setAttribute('directory', '')
                node.setAttribute('mozdirectory', '')
              }
            }}
            type="file"
            className="hidden"
            onChange={handleChangeFolder}
          />
          <Button
            type="submit"
            className={cn(`${isPending && `w-28`}`)}
            disabled={isPending || !isEnableImportButton}
            onClick={() => openModal('confirm-modal', null)}
          >
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Import
          </Button>
        </div>
      </div>
      <ImportList
        ref={gridRef}
        imports={imports}
        onSelectionChanged={handleSelectionChanged}
      />
    </div>
  )
}
