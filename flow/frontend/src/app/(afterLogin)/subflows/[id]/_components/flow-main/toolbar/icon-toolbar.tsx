'use client'

import ConfirmModal from '@/app/_components/confirm-modal'
import {
  CompileIcon,
  CopyIcon,
  CutIcon,
  DarkCompileIcon,
  DarkCopyIcon,
  DarkCutIcon,
  DarkDeleteIcon,
  DarkGrabIcon,
  DarkLinkIcon,
  DarkPasteIcon,
  DarkPointerIcon,
  DarkRedoIcon,
  DarkSelectAllIcon,
  DarkSnapshotIcon,
  DarkUndoIcon,
  DeleteIcon,
  GrabIcon,
  LinkIcon,
  PasteIcon,
  PointerIcon,
  RedoIcon,
  SelectAllIcon,
  SnapshotIcon,
  UndoIcon,
} from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { useWebSocket } from '@/contexts/websocket-context'
import { useOptionsStateSynced } from '@/hooks/use-options-state-synced'
import { useCopyPaste, useRemove, useSelect, useUndoRedo } from '@/hooks/xyflow'
import { useUpdateSnapshot } from '@/services/subflow'
import { useQuerySnapshot } from '@/services/subflow/queries/use-query-snapshot'
import { useBuildStore } from '@/store/build'
import { useLayoutStore } from '@/store/layout'
import { useModalStore } from '@/store/modal'
import { useSubFlowStore } from '@/store/sub-flow'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { useRef } from 'react'
import { Tooltip } from 'react-tooltip'
import { useShallow } from 'zustand/react/shallow'
import CompileHandler from './compile-handler'
import SnapshotDropdown from './snapshot-dropdown'
import { BookmarkIcon } from 'lucide-react'

export function IconToolbar({ subFlowId }: { subFlowId: number }) {
  const { resolvedTheme } = useTheme()
  const { send } = useWebSocket()
  const [triggerFooter, setFooterTab] = useLayoutStore((state) => [
    state.triggerFooter,
    state.setFooterTab,
  ])
  const startCompile = useBuildStore(useShallow((state) => state.startCompile))
  const [options, setOptions] = useOptionsStateSynced()
  const openModal = useModalStore((state) => state.openModal)
  const [editMode, setEditMode] = useSubFlowStore((state) => [
    state.editMode,
    state.setEditMode,
  ])

  const tempSnapshotName = useRef('') // 복원할 스냅샷name을 임시로 저장한다
  const { canUndo, undo, canRedo, redo } = useUndoRedo(subFlowId)
  const { canCopy, copy, cut, canPaste, paste } = useCopyPaste(subFlowId)
  const { isSelected, selectAll } = useSelect()
  const { removeSelectedNode } = useRemove(subFlowId)
  const { data: snapshots } = useSuspenseQuery(useQuerySnapshot(subFlowId))
  const updateSnapshotMutation = useUpdateSnapshot()

  const executeSnapshot = () =>
    updateSnapshotMutation.mutate({
      flowId: subFlowId,
      name: tempSnapshotName.current,
    })

  const executeCompile = () => {
    triggerFooter('up')
    setFooterTab('compile')
    try {
      send('buildRequest', {
        buildType: 'compile',
        ifeVer: '1.0.0',
        subFlowId,
      })
      startCompile()
    } catch (e) {
      logger.error(e)
    }
  }

  const openSnapshotModal = (name: string) => {
    tempSnapshotName.current = name
    openModal('confirm-modal', null)
  }

  return (
    <div className="flex items-start gap-4 rounded border border-solid border-gray-350 bg-white p-2 dark:border-[#636669] dark:bg-[#383C40]">
      <Modal id="confirm-modal">
        <ConfirmModal
          content="정말 복원하시겠습니까"
          onConfirm={executeSnapshot}
        />
      </Modal>
      {resolvedTheme === 'light' ? (
        <>
          <UndoIcon
            data-tooltip-id="undo"
            data-tooltip-content="undo"
            onClick={undo}
            disabled={!canUndo}
          />
          <RedoIcon
            data-tooltip-id="redo"
            data-tooltip-content="redo"
            onClick={redo}
            disabled={!canRedo}
          />
          <CopyIcon
            data-tooltip-id="copy"
            data-tooltip-content="copy"
            onClick={copy}
            disabled={!canCopy}
          />
          <CutIcon
            data-tooltip-id="cut"
            data-tooltip-content="cut"
            onClick={cut}
            disabled={!canCopy}
          />
          <PasteIcon
            data-tooltip-id="paste"
            data-tooltip-content="paste"
            onClick={() => paste()}
            disabled={!canPaste}
          />
          <DeleteIcon
            data-tooltip-id="delete"
            data-tooltip-content="delete"
            onClick={removeSelectedNode}
            disabled={!isSelected()}
          />
          <SelectAllIcon
            data-tooltip-id="select"
            data-tooltip-content="select"
            onClick={selectAll}
          />
          <CompileIcon
            data-tooltip-id="compile"
            data-tooltip-content="compile"
            onClick={executeCompile}
          />
          {editMode === 'grab' ? (
            <GrabIcon
              data-tooltip-id="edit"
              data-tooltip-content="grab"
              onClick={() => setEditMode('link')}
            />
          ) : editMode === 'pointer' ? (
            <PointerIcon />
          ) : (
            <LinkIcon
              data-tooltip-id="edit"
              data-tooltip-content="link"
              onClick={() => setEditMode('grab')}
            />
          )}
          <SnapshotDropdown
            snapshots={snapshots}
            disabled={!options?.snapShot.use}
            onClick={openSnapshotModal}
          >
            <SnapshotIcon
              data-tooltip-id="snapshot"
              data-tooltip-content="snapshot"
              disabled={!options?.snapShot.use}
            />
          </SnapshotDropdown>
        </>
      ) : (
        <>
          <DarkUndoIcon
            data-tooltip-id="undo"
            data-tooltip-content="undo"
            onClick={undo}
            disabled={!canUndo}
          />
          <DarkRedoIcon
            data-tooltip-id="redo"
            data-tooltip-content="redo"
            onClick={redo}
            disabled={!canRedo}
          />
          <DarkCopyIcon
            data-tooltip-id="copy"
            data-tooltip-content="copy"
            onClick={copy}
            disabled={!canCopy}
          />
          <DarkCutIcon
            data-tooltip-id="cut"
            data-tooltip-content="cut"
            onClick={cut}
            disabled={!canCopy}
          />
          <DarkPasteIcon
            data-tooltip-id="paste"
            data-tooltip-content="paste"
            onClick={() => paste()}
            disabled={!canPaste}
          />
          <DarkDeleteIcon
            data-tooltip-id="delete"
            data-tooltip-content="delete"
            onClick={removeSelectedNode}
            disabled={!isSelected()}
          />
          <DarkSelectAllIcon
            data-tooltip-id="select"
            data-tooltip-content="select"
            onClick={selectAll}
          />
          <DarkCompileIcon
            data-tooltip-id="compile"
            data-tooltip-content="compile"
            onClick={executeCompile}
          />
          {editMode === 'grab' ? (
            <DarkGrabIcon
              data-tooltip-id="edit"
              data-tooltip-content="grab"
              onClick={() => setEditMode('link')}
            />
          ) : editMode === 'pointer' ? (
            <DarkPointerIcon className="dark-icon" />
          ) : (
            <DarkLinkIcon
              data-tooltip-id="edit"
              data-tooltip-content="link"
              onClick={() => setEditMode('grab')}
            />
          )}
          <SnapshotDropdown
            snapshots={snapshots}
            disabled={!options?.snapShot.use}
            onClick={openSnapshotModal}
          >
            <DarkSnapshotIcon
              data-tooltip-id="snapshot"
              data-tooltip-content="snapshot"
              disabled={!options?.snapShot.use}
            />
          </SnapshotDropdown>
        </>
      )}
      <Tooltip opacity={1} id="undo" />
      <Tooltip opacity={1} id="redo" />
      <Tooltip opacity={1} id="copy" />
      <Tooltip opacity={1} id="cut" />
      <Tooltip opacity={1} id="paste" />
      <Tooltip opacity={1} id="delete" />
      <Tooltip opacity={1} id="select" />
      <Tooltip opacity={1} id="compile" />
      <Tooltip opacity={1} id="edit" />
      <Tooltip opacity={1} id="snapshot" />
      <CompileHandler />
    </div>
  )
}
