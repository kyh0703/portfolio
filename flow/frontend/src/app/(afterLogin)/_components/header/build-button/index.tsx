'use client'

import { useWebSocket } from '@/contexts/websocket-context'
import {
  BuildProgress,
  BuildResult,
  MessageLog,
  StatusLog,
  type BuildType,
} from '@/models/build'
import { useBuildStore } from '@/store/build'
import { useLayoutStore } from '@/store/layout'
import logger from '@/utils/logger'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { ActiveButton } from './active-button'
import IdleButton from './idle-button'

export default function BuildButton() {
  const { send, subscribe } = useWebSocket()
  const [
    isBuilding,
    startBuild,
    startBuildStop,
    appendBuildMessages,
    doneBuild,
    setBuildStatus,
  ] = useBuildStore(
    useShallow((state) => [
      state.build.isBuilding,
      state.startBuild,
      state.startBuildStop,
      state.appendBuildMessages,
      state.doneBuild,
      state.setBuildStatus,
    ]),
  )
  const [triggerFooter, setFooterTab] = useLayoutStore((state) => [
    state.triggerFooter,
    state.setFooterTab,
  ])
  const previousStatusRef = useRef(false)
  const [isSelf, setIsSelf] = useState(false)

  const onStart = useCallback(
    (data: BuildProgress<MessageLog>) => {
      const { data: inner } = data
      switch (inner.buildType) {
        case 'build':
        case 'rebuild':
          startBuild(true)
          appendBuildMessages(data)
          break
      }
    },
    [appendBuildMessages, startBuild],
  )

  const onProgress = useCallback(
    (data: BuildProgress<MessageLog | StatusLog>) => {
      const { data: inner } = data
      switch (inner.buildType) {
        case 'build':
        case 'rebuild':
          if (inner.logs.type === 'Message') {
            appendBuildMessages(data as BuildProgress<MessageLog>)
          } else {
            setBuildStatus(data as BuildProgress<StatusLog>)
          }
          break
      }
    },
    [setBuildStatus, appendBuildMessages],
  )

  const onResult = useCallback(
    (data: BuildResult) => {
      const { data: inner } = data
      switch (inner.buildType) {
        case 'build':
        case 'rebuild':
          doneBuild(data)
          setIsSelf(false)
          previousStatusRef.current = false
          break
      }
    },
    [doneBuild],
  )

  const handleRequestBuild = useCallback(
    (buildType: BuildType) => {
      try {
        switch (buildType) {
          case 'build':
          case 'rebuild':
            triggerFooter('up')
            setFooterTab('build')
            break
          case 'buildstop':
            startBuildStop()
            break
          default:
            return
        }
        send('buildRequest', {
          buildType,
          ifeVer: '1.0.0',
          subFlowId: 0,
        })
        setIsSelf(true)
      } catch (error) {
        logger.error('빌드 요청 중 오류 발생:', error)
      }
    },
    [send, setFooterTab, startBuildStop, triggerFooter],
  )

  useEffect(() => {
    const unsubscribeStart = subscribe('buildStart', onStart)
    const unsubscribeProgress = subscribe('buildProgress', onProgress)
    const unsubscribeResult = subscribe('buildResult', onResult)
    return () => {
      unsubscribeStart()
      unsubscribeProgress()
      unsubscribeResult()
    }
  }, [onProgress, onResult, onStart, subscribe])

  const BuildButtonComponent = isBuilding ? ActiveButton : IdleButton
  return <BuildButtonComponent onClick={handleRequestBuild} isSelf={isSelf} />
}
