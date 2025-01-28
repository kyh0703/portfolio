'use client'

import { useWebSocket } from '@/contexts/websocket-context'
import {
  BuildProgress,
  BuildResult,
  MessageLog,
  StatusLog,
} from '@/models/build'
import { useBuildStore } from '@/store/build'
import { useLayoutStore } from '@/store/layout'
import logger from '@/utils/logger'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { ActiveButton } from './active-button'
import IdleButton from './idle-button'

type BuildType = 'build' | 'rebuild' | 'buildstop'

export default function BuildButton() {
  const { send, subscribe } = useWebSocket()
  const [
    isBuilding,
    startBuild,
    appendBuildMessages,
    doneBuild,
    setBuildStatus,
    appendCompileMessages,
    doneCompile,
  ] = useBuildStore(
    useShallow((state) => [
      state.build.isBuilding,
      state.startBuild,
      state.appendBuildMessages,
      state.doneBuild,
      state.setBuildStatus,
      state.appendCompileMessages,
      state.doneCompile,
    ]),
  )
  const previousStatusRef = useRef<boolean>(false)
  const [isSelf, setIsSelf] = useState<boolean>(false)
  const [triggerFooter, setFooterTab] = useLayoutStore((state) => [
    state.triggerFooter,
    state.setFooterTab,
  ])

  const handleProgress = useCallback(
    (data: BuildProgress<MessageLog | StatusLog>) => {
      const { data: inner } = data
      if (['Build', 'Rebuild'].includes(inner.buildType)) {
        startBuild(data.type === 'buildStart')
      }
      switch (inner.logs.type) {
        case 'Message':
          if (inner.buildType === 'Compile') {
            appendCompileMessages(data as BuildProgress<MessageLog>)
          } else {
            appendBuildMessages(data as BuildProgress<MessageLog>)
          }
          break
        case 'Status':
          setBuildStatus(data as BuildProgress<StatusLog>)
          break
      }
    },
    [startBuild, setBuildStatus, appendBuildMessages, appendCompileMessages],
  )

  const handleResult = useCallback(
    (data: BuildResult) => {
      if (data.data.buildType === 'Compile') {
        doneCompile(data)
      } else {
        doneBuild(data)
      }
      setIsSelf(false)
      previousStatusRef.current = false
    },
    [doneBuild, doneCompile],
  )

  useEffect(() => {
    const unsubscribeStart = subscribe('buildStart', handleProgress)
    const unsubscribeProgress = subscribe('buildProgress', handleProgress)
    const unsubscribeResult = subscribe('buildResult', handleResult)
    return () => {
      unsubscribeStart()
      unsubscribeProgress()
      unsubscribeResult()
    }
  }, [handleProgress, handleResult, subscribe])

  const handleRequestBuild = useCallback(
    (buildType: BuildType) => {
      if (['build', 'rebuild'].includes(buildType)) {
        triggerFooter('up')
        setFooterTab('build')
      }

      try {
        send({
          type: 'buildRequest',
          data: {
            buildType,
            ifeVer: '1.0.0',
            subFlowId: 0,
          },
          timestamp: new Date(),
        })
        setIsSelf(true)
      } catch (error) {
        logger.error('빌드 요청 중 오류 발생:', error)
      }
    },
    [send, setFooterTab, triggerFooter],
  )

  const BuildButtonComponent = isBuilding ? ActiveButton : IdleButton

  return <BuildButtonComponent onClick={handleRequestBuild} isSelf={isSelf} />
}
