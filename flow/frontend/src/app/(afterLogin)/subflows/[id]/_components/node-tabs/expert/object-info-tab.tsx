'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Grid from '@/app/_components/grid'
import Label from '@/app/_components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { END_METHOD_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { ObjectInfo, ObjectList, RequestPage } from '@/models/property/iweb'
import { getNodeProperty } from '@/services/subflow'
import { Separator } from '@/ui/separator'
import { AppEdge, AppNode, useReactFlow } from '@xyflow/react'
import { ColDef } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<ObjectList>[] = [
  {
    headerName: 'Object ID',
    field: 'id',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Variable',
    field: 'variable',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
]

export default function ObjectInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const { getNodes } = useReactFlow<AppNode, AppEdge>()
  const objectInfo = getValues(props.tabName) as ObjectInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const [rowData, setRowData] = useState<ObjectList[]>([])

  const requestPageNodes = getNodes().filter(
    (node) => node.type === 'RequestPage',
  )

  useEffect(() => {
    let ignore = false

    const requestPage = requestPageNodes.find(
      (node) => node.id === objectInfo?.reqPage,
    )
    if (requestPage) {
      getNodeProperty<RequestPage>(requestPage.data.databaseId!).then(
        (data) => {
          const tempData = data.property.info.inputObjectList.map((obj) => ({
            id: obj,
            variable: `OID_${obj}`,
          }))
          setRowData(tempData)
          setValue('objectInfo.objectList', tempData)
        },
      )
    } else {
      setRowData([])
      setValue('objectInfo.objectList', [])
    }

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectInfo?.reqPage])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Name</h3>
          <Autocomplete
            name="objectInfo.name"
            value={objectInfo?.name}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.objectInfo?.name && (
            <span className="error-msg">{errors.objectInfo.name.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Transaction ID</h3>
          <Autocomplete
            name="objectInfo.transId"
            value={objectInfo?.transId}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 iWeb Adaptor 목록
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.objectInfo?.transId && (
            <span className="error-msg">
              {errors.objectInfo.transId.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Request Page</h3>
          <Autocomplete
            name="objectInfo.reqPage"
            value={objectInfo?.reqPage}
            options={options}
            selectOptions={requestPageNodes.map((node) => node.id)}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.objectInfo?.reqPage && (
            <span className="error-msg">
              {errors.objectInfo.reqPage.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Page Name</h3>
          <Autocomplete
            name="objectInfo.pageName"
            value={objectInfo?.pageName}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <h2>Object ID</h2>
        <div className="h-60">
          <Grid
            columnDefs={colDefs}
            rowData={rowData}
            rowDragManaged={false}
            pagination={false}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <div className="flex gap-3">
            <Checkbox
              id="objectInfo.useTimeout"
              checked={objectInfo?.useTimeout}
              onCheckedChange={(checked) =>
                setValue('objectInfo.useTimeout', !!checked)
              }
            />
            <Label htmlFor="useTimeout">Use Timeout</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="objectInfo.timeout"
              value={objectInfo?.timeout}
              options={options}
              disabled={!objectInfo?.useTimeout}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(ms)</h3>
          </div>
          {errors.info?.timeout && (
            <span className="error-msg">
              {errors.objectInfo.timeout.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>End Method</h3>
          <Select
            value={objectInfo?.endMethod}
            onValueChange={(value) => setValue('objectInfo.endMethod', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {END_METHOD_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.objectInfo?.endMethod && (
            <span className="error-msg">
              {errors.objectInfo.endMethod.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Condition</h3>
          <Autocomplete
            name="objectInfo.condition"
            value={objectInfo?.condition}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.objectInfo?.condition && (
            <span className="error-msg">
              {errors.objectInfo.condition.message}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
