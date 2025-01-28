'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import ConfirmModal from '@/app/_components/confirm-modal'
import { Form } from '@/app/_components/form'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormGrid from '@/app/_components/form-grid'
import FormInput from '@/app/_components/form-input'
import { PlusIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineIntent, EntityList } from '@/models/define'
import { useAddDefine } from '@/services/define'
import { getInFlows, useAddSubFlow, useQueryAllInFlow } from '@/services/flow'
import { getMenu, useQueryMenus } from '@/services/menu'
import { useDefineStore } from '@/store/define'
import { useModalStore } from '@/store/modal'
import type { DefineScope } from '@/types/define'
import { Separator } from '@/ui/separator'
import { removeDuplicateMenus, removeMainOrEndFlows } from '@/utils/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQueries } from '@tanstack/react-query'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import EntityForm from '../entity-form'

const colDefs: ColDef<EntityList>[] = [
  {
    headerName: 'EntityID',
    field: 'info.id',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'EntityName',
    field: 'info.name',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  { field: 'info', hide: true },
  { field: 'mentInfo', hide: true },
  { field: 'digitInfo', hide: true },
  { field: 'chatInfo', hide: true },
]

const schema = Yup.object().shape({
  id: Yup.string()
    .required('ID를 입력해주세요.')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  name: Yup.string().required('Name을 입력해주세요.'),
})

export default function IntentRegisterForm({ scope }: { scope: DefineScope }) {
  const router = useRouter()
  const gridRef = useRef<AgGridReact<EntityList>>(null)
  const gridOptions = useGridOption<EntityList>()
  const {
    getSelectedRow,
    addRow,
    updateRowByRowIndex,
    cut,
    copy,
    paste,
    remove,
    onKeyDown,
  } = useGridHook<EntityList>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData] = useState<EntityList[]>([])

  const openModal = useModalStore(useShallow((state) => state.openModal))
  const [isOpen, openEntityForm, closeEntityForm] = useDefineStore(
    useShallow((state) => [
      state.formOpen,
      state.openEntityForm,
      state.closeEntityForm,
    ]),
  )

  const methods = useForm<DefineIntent>({
    defaultValues: {
      global: false,
      name: '',
      id: '',
      menuCall: '',
      subCall: '',
      entityList: [],
    },
    resolver: yupResolver(schema),
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods
  const [watchMenu, watchSubCall] = useWatch({
    control: methods.control,
    name: ['menuCall', 'subCall'],
  })

  const { mutate: addSubFlowMutate } = useAddSubFlow()
  const addMutation = useAddDefine<DefineIntent>('intent')

  const { menuList, subFlowList } = useSuspenseQueries({
    queries: [useQueryMenus(), useQueryAllInFlow()],
    combine: (results) => {
      return {
        menuList: removeDuplicateMenus(results[0].data),
        subFlowList: removeMainOrEndFlows(results[1].data.flow),
      }
    },
  })

  const menuOptions = useMemo(() => {
    return menuList?.map((menu) => menu.property.id)
  }, [menuList])

  const subFlowOptions = useMemo(() => {
    return subFlowList.map((subCall) => subCall.name)
  }, [subFlowList])

  const onSubmit = (data: DefineIntent) => {
    addMutation.mutate(
      {
        scope,
        type: 'intent',
        defineId: data.id,
        data,
      },
      {
        onSuccess: () => {
          router.push(`/defines/${scope}/intent`)
        },
      },
    )
  }

  const moveMenu = async () => {
    if (!watchMenu) {
      toast.warn('Menu ID를 입력해주세요.')
      return
    }

    const menuInfo = menuList.find((menu) => menu.property.id === watchMenu)
    if (!menuInfo) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    const menu = await getMenu(menuInfo.id)
    if (!menu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    router.push(`/defines/global/menu/${menu.property.rootId}`)
  }

  const openMenu = async () => {
    if (!watchMenu) {
      toast.warn('Menu ID를 입력해주세요.')
      return
    }

    const menuInfo = menuList.find((menu) => menu.property.id === watchMenu)
    if (!menuInfo) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    const menu = await getMenu(menuInfo.id)
    if (!menu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    if (!menu.property.subFlowName) {
      return
    }

    const subFlowList = await getInFlows()
    const subFlow = subFlowList.flow.find(
      (subFlow) => subFlow.name === menu.property.subFlowName,
    )
    if (!subFlow) {
      return
    }

    router.push(`/subflows/${subFlow.id}`)
  }

  const openSubFlow = () => {
    if (!subFlowOptions.find((subFlow) => subFlow === watchSubCall)) {
      toast.warn('SubCall을 찾을 수 없습니다.')
      return
    }

    const subFlowId = subFlowList.find(
      (subFlow) => subFlow.name === watchSubCall,
    )!.id

    router.push(`/subflows/${subFlowId}`)
  }

  const createSubCall = () => {
    if (!watchSubCall) {
      toast.warn('SubCall을 입력해주세요.')
      return
    }

    if (!subFlowOptions.find((subFlow) => subFlow === watchSubCall)) {
      addSubFlowMutate(
        {
          name: watchSubCall!,
          version: '1.0.0',
          desc: '',
          args: { in: { param: [] }, out: { arg: [] } },
          updateDate: new Date(),
        },
        {
          onSuccess: (response) => {
            router.push(`/subflows/${response.flowId}`)
          },
        },
      )
    } else {
      const subFlowId = subFlowList.find(
        (subFlow) => subFlow.name === watchSubCall,
      )!.id
      router.push(`/subflows/${subFlowId}`)
    }
  }

  const handleConfirm = (data: string) => {
    switch (data) {
      case 'menuMove':
        moveMenu()
        break
      case 'menuOpen':
        openMenu()
        break
      case 'flowOpen':
        openSubFlow()
        break
      case 'flowCreate':
        createSubCall()
        break
    }
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<EntityList>) => {
    openEntityForm({ mode: 'update', data: event.data })
  }

  const handleEntitySubmit = (mode: 'create' | 'update', data: EntityList) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, getSelectedRow()?.rowIndex)
    }
  }

  const handleContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: remove,
      cut: cut,
      copy: copy,
      paste: paste,
    }
    actions[item]?.()
  }

  useEffect(() => {
    closeEntityForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Form {...methods}>
      {contextMenu && (
        <GridContextMenu
          {...contextMenu}
          onItemClick={handleContextMenuClick}
          onClick={() => setContextMenu(null)}
        />
      )}
      <Modal id="confirm-modal">
        <ConfirmModal
          content="이동하시면 데이터가 저장되지 않습니다. 이동하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <div className="relative h-full w-full">
        <form
          className="absolute left-0 top-0 flex h-full w-full flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center justify-between p-6">
            <h2>Intent definition</h2>
            <div className="space-x-3">
              <Button variant="error" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">OK</Button>
            </div>
          </div>
          <Separator />
          <div className="flex flex-grow flex-col gap-6 p-6">
            <div className="space-y-6">
              <FormCheckbox
                control={control}
                name="global"
                label="Global Intent"
              />
              <div className="space-y-6">
                <div className="flex items-end gap-7">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3>Intent ID</h3>
                      {errors.id && (
                        <span className="error-msg">{errors.id.message}</span>
                      )}
                    </div>
                    <FormInput control={control} name="id" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3>Action MenuCall</h3>
                    <FormAutocomplete
                      control={control}
                      name="menuCall"
                      selectOptions={menuOptions}
                    />
                  </div>
                  <div className="space-x-3">
                    <Button
                      variant="secondary3"
                      onClick={() => openModal('confirm-modal', 'menuMove')}
                    >
                      Move
                    </Button>
                    <Button
                      variant="secondary3"
                      onClick={() => openModal('confirm-modal', 'menuOpen')}
                    >
                      Open
                    </Button>
                  </div>
                </div>
                <div className="flex items-end gap-7">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3>Intent Name</h3>
                      {errors.name && (
                        <span className="error-msg">{errors.name.message}</span>
                      )}
                    </div>
                    <FormInput control={control} name="name" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3>Action SubCall</h3>
                    <FormAutocomplete
                      control={control}
                      name="subCall"
                      selectOptions={subFlowOptions}
                    />
                  </div>
                  <div className="space-x-3">
                    <Button
                      variant="secondary3"
                      onClick={() => openModal('confirm-modal', 'flowOpen')}
                    >
                      Open
                    </Button>
                    <Button
                      variant="secondary3"
                      onClick={() => openModal('confirm-modal', 'flowCreate')}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex h-full flex-1 flex-col space-y-3">
              <div className="flex items-center justify-end">
                <Button
                  className="flex items-center justify-between"
                  variant="secondary2"
                  onClick={() => openEntityForm({ mode: 'create' })}
                >
                  <PlusIcon width={20} height={20} />
                  Add
                </Button>
              </div>
              <div className="flex-grow">
                <FormGrid
                  ref={gridRef}
                  control={control}
                  name="entityList"
                  gridOptions={gridOptions}
                  columnDefs={colDefs}
                  rowData={rowData}
                  rowDragManaged={true}
                  pagination={false}
                  onRowDoubleClicked={handleRowDoubleClicked}
                  onCellContextMenu={onCellContextMenu}
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>
          </div>
        </form>
        {isOpen && <EntityForm onSubmit={handleEntitySubmit} />}
      </div>
    </Form>
  )
}
