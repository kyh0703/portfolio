'use client'

import {
  CopyIcon,
  CutIcon,
  DarkCopyIcon,
  DarkCutIcon,
  DarkDeleteIcon,
  DarkGrabIcon,
  DarkLinkIcon,
  DarkPasteIcon,
  DarkPointerIcon,
  DarkRedoIcon,
  DarkSelectAllIcon,
  DarkUndoIcon,
  DeleteIcon,
  GrabIcon,
  LinkIcon,
  PasteIcon,
  PointerIcon,
  RedoIcon,
  SelectAllIcon,
  UndoIcon,
} from '@/app/_components/icon'
import { useWebSocket } from '@/contexts/websocket-context'
import { useOptionsStateSynced } from '@/hooks/use-options-state-synced'
import { useCopyPaste, useRemove, useSelect, useUndoRedo } from '@/hooks/xyflow'
import { useLayoutStore } from '@/store/layout'
import { useModalStore } from '@/store/modal'
import { useSubFlowStore } from '@/store/flow'
import { useTheme } from 'next-themes'
import { Tooltip } from 'react-tooltip'

export function IconToolbar({ flowId }: { flowId: number }) {
  const { resolvedTheme } = useTheme()
  const { send } = useWebSocket()
  const [triggerFooter, setFooterTab] = useLayoutStore((state) => [
    state.triggerFooter,
    state.setFooterTab,
  ])
  const [options, setOptions] = useOptionsStateSynced()
  const openModal = useModalStore((state) => state.openModal)
  const [editMode, setEditMode] = useSubFlowStore((state) => [
    state.editMode,
    state.setEditMode,
  ])

  const { canUndo, undo, canRedo, redo } = useUndoRedo(flowId)
  const { canCopy, copy, cut, canPaste, paste } = useCopyPaste(flowId)
  const { isSelected, selectAll } = useSelect()
  const { removeSelectedNode } = useRemove(flowId)

  return (
    <div className="flex items-start gap-4 rounded border border-solid border-gray-350 bg-white p-2 dark:border-[#636669] dark:bg-[#383C40]">
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
    </div>
  )
}
