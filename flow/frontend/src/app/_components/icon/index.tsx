'use client'

// define
import FileMenu from '../../../../public/defines/file-menu.svg'
import FileSub from '../../../../public/defines/file-sub.svg'

// header
import DarkExit from '../../../../public/header/dark/exit.svg'
import DarkUser from '../../../../public/header/dark/user.svg'
import Exit from '../../../../public/header/exit.svg'
import User from '../../../../public/header/user.svg'

// sidebar
import BottomClose from '../../../../public/sidebar/bottom-close.svg'
import Components from '../../../../public/sidebar/components.svg'
import Configs from '../../../../public/sidebar/configs.svg'
import Defines from '../../../../public/sidebar/defines.svg'
import Flows from '../../../../public/sidebar/flows.svg'
import Helper from '../../../../public/sidebar/helper.svg'
import Search from '../../../../public/sidebar/search.svg'

// icon
// dark
import { cn } from '@/utils'
import type React from 'react'
import Add from '../../../../public/icons/add.svg'
import BottomArrow from '../../../../public/icons/bottom-arrow.svg'
import Close from '../../../../public/icons/close.svg'
import Compile from '../../../../public/icons/compile.svg'
import Copy from '../../../../public/icons/copy.svg'
import Cut from '../../../../public/icons/cut.svg'
import DarkCompile from '../../../../public/icons/dark/compile.svg'
import DarkCopy from '../../../../public/icons/dark/copy.svg'
import DarkCut from '../../../../public/icons/dark/cut.svg'
import DarkDelete from '../../../../public/icons/dark/delete.svg'
import DarkGrab from '../../../../public/icons/dark/grab.svg'
import DarkLink from '../../../../public/icons/dark/link.svg'
import DarkPaste from '../../../../public/icons/dark/paste.svg'
import DarkPointer from '../../../../public/icons/dark/pointer.svg'
import DarkRedo from '../../../../public/icons/dark/redo.svg'
import DarkSelectAll from '../../../../public/icons/dark/select.svg'
import DarkSnapshot from '../../../../public/icons/dark/snapshot.svg'
import DarkUndo from '../../../../public/icons/dark/undo.svg'
import Delete from '../../../../public/icons/delete.svg'
import Drag from '../../../../public/icons/drag.svg'
import Error from '../../../../public/icons/error.svg'
import Fold from '../../../../public/icons/fold.svg'
import Grab from '../../../../public/icons/grab.svg'
import HamburgerMenu from '../../../../public/icons/hamburger-menu.svg'
import Invisible from '../../../../public/icons/invisible.svg'
import Link from '../../../../public/icons/link.svg'
import Logo from '../../../../public/icons/logo.svg'
import Loading from '../../../../public/icons/loading.svg'
import MenuDot from '../../../../public/icons/menu-dot.svg'
import Menu from '../../../../public/icons/menu.svg'
import Moon from '../../../../public/icons/moon.svg'
import Paste from '../../../../public/icons/paste.svg'
import PlayOn from '../../../../public/icons/playon.svg'
import Plus from '../../../../public/icons/plus.svg'
import Pointer from '../../../../public/icons/pointer.svg'
import Redo from '../../../../public/icons/redo.svg'
import Refresh from '../../../../public/icons/refresh.svg'
import Rename from '../../../../public/icons/rename.svg'
import RightArrowIcon from '../../../../public/icons/right-arrow.svg'
import InputSearch from '../../../../public/icons/search.svg'
import SelectAll from '../../../../public/icons/select.svg'
import Snapshot from '../../../../public/icons/snapshot.svg'
import Success from '../../../../public/icons/success.svg'
import Sun from '../../../../public/icons/sun.svg'
import TabLeftArrowIcon from '../../../../public/icons/tab-left-arrow.svg'
import TabRightArrowIcon from '../../../../public/icons/tab-right-arrow.svg'
import TopArrow from '../../../../public/icons/top-arrow.svg'
import TriangleLeft from '../../../../public/icons/triangle-left.svg'
import TriangleRight from '../../../../public/icons/triangle-right.svg'
import Undo from '../../../../public/icons/undo.svg'
import Unfold from '../../../../public/icons/unfold.svg'
import Visible from '../../../../public/icons/visible.svg'
import X from '../../../../public/icons/x.svg'

export type IconButtonProps = {
  width?: number
  height?: number
  className?: string
  color?: string
  backgroundColor?: string
  disabled?: boolean
  cursor?: string
  onClick?: React.MouseEventHandler<SVGSVGElement>
}

function withIconStyle(
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
): React.ComponentType<IconButtonProps> {
  const IconWithStyle = ({
    className,
    width = 24,
    height = 24,
    cursor,
    disabled,
    onClick,
    color,
    backgroundColor,
    ...rest
  }: IconButtonProps) => {
    const cur = cursor ? cursor : onClick ? 'pointer' : ''

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          fontSize: `${(width + height) / 2}px`,
          backgroundColor: backgroundColor,
          color: color,
          cursor: disabled ? 'none' : cur,
          opacity: disabled ? 0.1 : 1,
        }}
        className={cn('flex items-center justify-center', className)}
        {...rest}
      >
        <Icon
          fontSize="inherit"
          color="inherit"
          onClick={onClick as React.MouseEventHandler<SVGSVGElement>}
        />
      </div>
    )
  }

  return IconWithStyle
}

// defines
export const FileMenuIcon = withIconStyle(FileMenu)
export const FileSubIcon = withIconStyle(FileSub)

// icons
export { RightArrowIcon, TabLeftArrowIcon, TabRightArrowIcon }

// dark
export const DarkUndoIcon = withIconStyle(DarkUndo)
export const DarkRedoIcon = withIconStyle(DarkRedo)
export const DarkCopyIcon = withIconStyle(DarkCopy)
export const DarkCutIcon = withIconStyle(DarkCut)
export const DarkPasteIcon = withIconStyle(DarkPaste)
export const DarkDeleteIcon = withIconStyle(DarkDelete)
export const DarkSelectAllIcon = withIconStyle(DarkSelectAll)
export const DarkCompileIcon = withIconStyle(DarkCompile)
export const DarkGrabIcon = withIconStyle(DarkGrab)
export const DarkPointerIcon = withIconStyle(DarkPointer)
export const DarkLinkIcon = withIconStyle(DarkLink)
export const DarkSnapshotIcon = withIconStyle(DarkSnapshot)

export const TriangleLeftIcon = withIconStyle(TriangleLeft)
export const TriangleRightIcon = withIconStyle(TriangleRight)
export const HamburgerMenuIcon = withIconStyle(HamburgerMenu)
export const BottomArrowIcon = withIconStyle(BottomArrow)
export const CompileIcon = withIconStyle(Compile)
export const CloseIcon = withIconStyle(Close)
export const PlayOnIcon = withIconStyle(PlayOn)
export const CopyIcon = withIconStyle(Copy)
export const CutIcon = withIconStyle(Cut)
export const DeleteIcon = withIconStyle(Delete)
export const ErrorIcon = withIconStyle(Error)
export const PasteIcon = withIconStyle(Paste)
export const PlusIcon = withIconStyle(Plus)
export const RedoIcon = withIconStyle(Redo)
export const LogoIcon = withIconStyle(Logo)
export const LoadingIcon = withIconStyle(Loading)
export const InputSearchIcon = withIconStyle(InputSearch)
export const SelectAllIcon = withIconStyle(SelectAll)
export const SnapshotIcon = withIconStyle(Snapshot)
export const InVisibleIcon = withIconStyle(Invisible)
export const SuccessIcon = withIconStyle(Success)
export const TopArrowIcon = withIconStyle(TopArrow)
export const UndoIcon = withIconStyle(Undo)
export const VisibleIcon = withIconStyle(Visible)
export const XIcon = withIconStyle(X)
export const GrabIcon = withIconStyle(Grab)
export const LinkIcon = withIconStyle(Link)
export const PointerIcon = withIconStyle(Pointer)
export const AddIcon = withIconStyle(Add)
export const MenuIcon = withIconStyle(Menu)
export const MenuDotIcon = withIconStyle(MenuDot)
export const FormatColorTextIcon = withIconStyle(MenuDot)
export const FormatColorFillIcon = withIconStyle(MenuDot)
export const FormatColorShapesIcon = withIconStyle(MenuDot)
export const PushPinIcon = withIconStyle(MenuDot)
export const DragIcon = withIconStyle(Drag)
export const RefreshIcon = withIconStyle(Refresh)
export const RenameIcon = withIconStyle(Rename)
export const SunIcon = withIconStyle(Sun)
export const MoonIcon = withIconStyle(Moon)
export const FoldIcon = withIconStyle(Fold)
export const UnfoldIcon = withIconStyle(Unfold)

// header
export const DarkUserIcon = withIconStyle(DarkUser)
export const DarkExitIcon = withIconStyle(DarkExit)
export const UserIcon = withIconStyle(User)
export const ExitIcon = withIconStyle(Exit)

// sidebar
export const FlowsIcon = withIconStyle(Flows)
export const ComponentsIcon = withIconStyle(Components)
export const DefinesIcon = withIconStyle(Defines)
export const ConfigsIcon = withIconStyle(Configs)
export const SearchIcon = withIconStyle(Search)
export const HelperIcon = withIconStyle(Helper)
export const BottomCloseIcon = withIconStyle(BottomClose)

export * from './commands'
