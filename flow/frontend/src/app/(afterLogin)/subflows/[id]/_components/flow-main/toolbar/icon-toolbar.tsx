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
import { useCopyPaste, useRemove, useSelect, useUndoRedo } from '@/hooks/xyflow'
import { useUpdateSnapshot } from '@/services/snapshot'
import { useQuerySnapshot } from '@/services/snapshot/queries/use-query-snapshot'
import { useBuildStore } from '@/store/build'
import { useLayoutStore } from '@/store/layout'
import { useManagementStore } from '@/store/management'
import { useModalStore } from '@/store/modal'
import { useSubFlowStore } from '@/store/sub-flow'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { Tooltip } from 'react-tooltip'
import { useShallow } from 'zustand/react/shallow'
import SnapshotDropdown from './snapshot-dropdown'

export function IconToolbar({ subFlowId }: { subFlowId: number }) {
  const { send } = useWebSocket()
  const [triggerFooter, setFooterTab] = useLayoutStore((state) => [
    state.triggerFooter,
    state.setFooterTab,
  ])
  const startCompile = useBuildStore((state) => state.startCompile)
  const useSnapshot = useManagementStore(
    useShallow((state) => state.useSnapshot),
  )
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
      const message = {
        type: 'buildRequest',
        data: {
          buildType: 'compile',
          ifeVer: '1.0.0',
          subFlowId,
        },
        timestamp: new Date(),
      }
      send(message)
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
    <div className="flex items-start gap-4 rounded border border-solid border-gray-350 p-2">
      <Modal id="confirm-modal">
        <ConfirmModal
          content="정말 복원하시겠습니까"
          onConfirm={executeSnapshot}
        />
      </Modal>
      <UndoIcon
        className="light-icon"
        data-tooltip-id="undo"
        data-tooltip-content="undo"
        onClick={undo}
        disabled={!canUndo}
      />
      <DarkUndoIcon
        className="dark-icon"
        data-tooltip-id="undo"
        data-tooltip-content="undo"
        onClick={undo}
        disabled={!canUndo}
      />
      <RedoIcon
        className="light-icon"
        data-tooltip-id="redo"
        data-tooltip-content="redo"
        onClick={redo}
        disabled={!canRedo}
      />
      <DarkRedoIcon
        className="dark-icon"
        data-tooltip-id="redo"
        data-tooltip-content="redo"
        onClick={redo}
        disabled={!canRedo}
      />
      <CopyIcon
        className="light-icon"
        data-tooltip-id="copy"
        data-tooltip-content="copy"
        onClick={copy}
        disabled={!canCopy}
      />
      <DarkCopyIcon
        className="dark-icon"
        data-tooltip-id="copy"
        data-tooltip-content="copy"
        onClick={copy}
        disabled={!canCopy}
      />
      <CutIcon
        className="light-icon"
        data-tooltip-id="cut"
        data-tooltip-content="cut"
        onClick={cut}
        disabled={!canCopy}
      />
      <DarkCutIcon
        className="dark-icon"
        data-tooltip-id="cut"
        data-tooltip-content="cut"
        onClick={cut}
        disabled={!canCopy}
      />
      <PasteIcon
        className="light-icon"
        data-tooltip-id="paste"
        data-tooltip-content="paste"
        onClick={() => paste()}
        disabled={!canPaste}
      />
      <DarkPasteIcon
        className="dark-icon"
        data-tooltip-id="paste"
        data-tooltip-content="paste"
        onClick={() => paste()}
        disabled={!canPaste}
      />
      <DeleteIcon
        className="light-icon"
        data-tooltip-id="delete"
        data-tooltip-content="delete"
        onClick={removeSelectedNode}
        disabled={!isSelected()}
      />
      <DarkDeleteIcon
        className="dark-icon"
        data-tooltip-id="delete"
        data-tooltip-content="delete"
        onClick={removeSelectedNode}
        disabled={!isSelected()}
      />
      <SelectAllIcon
        className="light-icon"
        data-tooltip-id="select"
        data-tooltip-content="select"
        onClick={selectAll}
      />
      <DarkSelectAllIcon
        className="dark-icon"
        data-tooltip-id="select"
        data-tooltip-content="select"
        onClick={selectAll}
      />
      <CompileIcon
        className="light-icon"
        data-tooltip-id="compile"
        data-tooltip-content="compile"
        onClick={executeCompile}
      />
      <DarkCompileIcon
        className="dark-icon"
        data-tooltip-id="compile"
        data-tooltip-content="compile"
        onClick={executeCompile}
      />
      {editMode === 'grab' ? (
        <>
          <GrabIcon
            className="light-icon"
            data-tooltip-id="edit"
            data-tooltip-content="grab"
            onClick={() => setEditMode('link')}
          />
          <DarkGrabIcon
            className="dark-icon"
            data-tooltip-id="edit"
            data-tooltip-content="grab"
            onClick={() => setEditMode('link')}
          />
        </>
      ) : editMode === 'pointer' ? (
        <>
          <PointerIcon className="light-icon" />
          <DarkPointerIcon className="dark-icon" />
        </>
      ) : (
        <>
          <LinkIcon
            className="light-icon"
            data-tooltip-id="edit"
            data-tooltip-content="link"
            onClick={() => setEditMode('grab')}
          />
          <DarkLinkIcon
            className="dark-icon"
            data-tooltip-id="edit"
            data-tooltip-content="link"
            onClick={() => setEditMode('grab')}
          />
        </>
      )}
      <SnapshotDropdown
        snapshots={snapshots}
        disabled={!useSnapshot}
        onClick={openSnapshotModal}
      >
        <>
          <SnapshotIcon
            className="light-icon"
            data-tooltip-id="snapshot"
            data-tooltip-content="snapshot"
            disabled={!useSnapshot}
          />
          <DarkSnapshotIcon
            className="dark-icon"
            data-tooltip-id="snapshot"
            data-tooltip-content="snapshot"
            disabled={!useSnapshot}
          />
        </>
      </SnapshotDropdown>
      <Tooltip id="undo" />
      <Tooltip id="redo" />
      <Tooltip id="copy" />
      <Tooltip id="cut" />
      <Tooltip id="paste" />
      <Tooltip id="delete" />
      <Tooltip id="select" />
      <Tooltip id="edit" />
      <Tooltip id="snapshot" />
    </div>
  )
}
