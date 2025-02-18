'use client'

import { useBuildStore } from '@/store/build'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import { Progress } from '@/ui/progress'
import { useShallow } from 'zustand/react/shallow'

export default function BuildStatusModal() {
  const status = useBuildStore(useShallow((state) => state.build.status))
  if (!status) {
    return null
  }
  const message = status.data.logs.message

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Build Project</CardTitle>
          <CardDescription>Build Scenario Files in..</CardDescription>
          <CardDescription>
            Compile File Count: {message.procCount} / {message.totalCount}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Progress
            value={(message.procCount / message.totalCount) * 100}
            className="h-4 bg-muted"
          />
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Card className="w-1/2">
          <CardHeader className="h-28 p-4">
            <CardTitle className="text-lg">Node</CardTitle>
            <CardDescription>node build count</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pb-0">
            {message.procCountList &&
              Object.entries(message.currentInfoList).map(([key, info]) => {
                return (
                  <div key={key} className="h-10">
                    <p className="text-sm font-medium">
                      Count[{info.node.pCount}/{info.node.tCount}]-[
                      {info.subFlowName}]
                    </p>
                  </div>
                )
              })}
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader className="h-28 p-4">
            <CardTitle className="text-lg">Define & SubFlow</CardTitle>
            <CardDescription>define & subflow build progress</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pb-0">
            {message.procCountList &&
              Object.entries(message.procCountList).map(([key, info]) => {
                return (
                  <div key={key} className="h-10">
                    <div className="relative flex h-5 items-center">
                      <Progress
                        value={(info.pCount / info.tCount) * 100}
                        className="h-full bg-muted"
                      />
                      <div className="absolute right-0 top-0 flex h-full items-center px-2 text-xs">
                        {info.pCount} / {info.tCount}
                      </div>
                    </div>
                  </div>
                )
              })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
