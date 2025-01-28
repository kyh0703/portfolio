'use client'

import Autocomplete from '@/app/_components/autocomplete'
import Grid from '@/app/_components/grid'
import { Input } from '@/app/_components/input'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineCDR } from '@/models/define'
import { CdrCallInfo } from '@/models/property/flow'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'
import { NodePropertyTabProps } from '../node-property/types'

const colDefs: ColDef<string>[] = [
  {
    headerName: 'Name',
    valueGetter: (params) => params.data,
    valueSetter: (params) => {
      params.data = params.newValue
      return true
    },
    filter: false,
    flex: 1,
  },
]

export default function ProcedureInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const procInfo = getValues(props.tabName) as CdrCallInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const [desc, setDesc] = useState<string>()

  const gridRef = useRef<AgGridReact<string>>(null)
  const { rowData } = useGridNodeHook<string>(gridRef, {
    data: procInfo?.argList,
  })

  const { data: cdrs } = useSuspenseQuery({
    ...useQueryDefines<DefineCDR>('cdr'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const cdr = cdrs.find((cdr) => cdr.defineId === procInfo?.name)
    if (cdr) {
      setDesc(cdr.property.desc)
      setValue('procInfo.argList', cdr.property.param)
    }
  }, [cdrs, procInfo?.name, setValue])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Procedure Name</h3>
        <Autocomplete
          name="procInfo.name"
          value={procInfo?.name}
          options={options}
          selectOptions={cdrs.map((cdr) => cdr.defineId)}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        <Input value={desc} readOnly={true} onChange={() => {}} />
        {errors.procInfo?.name && (
          <span className="error-msg">{errors.procInfo.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Argument</h3>
        <div className="h-60">
          <Grid
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowData}
            pagination={false}
            suppressContextMenu={true}
          />
        </div>
        {errors.procInfo?.argList && (
          <span className="error-msg">{errors.procInfo.argList.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="procInfo.condition"
          value={procInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.procInfo?.condition && (
          <span className="error-msg">{errors.procInfo.condition.message}</span>
        )}
      </div>
    </div>
  )
}
