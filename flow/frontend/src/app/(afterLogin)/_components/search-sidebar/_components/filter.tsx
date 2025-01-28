'use client'

import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { useQueryAllInFlow } from '@/services/flow'
import { getNodePropertyByKind } from '@/services/subflow'
import { useSearchStore } from '@/store/search'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { globalItems as defines } from '../../define-sidebar/items'
import CustomFilterList, { nodes } from '../service/custom-filter-list'
import NameAutocomplete from './name-autocomplete'
import NodeTypeAutocomplete from './node-type-autocomplete'

export default function SearchFilter() {
  const [propertyList, setPropertyList] = useState<string[]>([])
  const [
    subFlowName,
    nodeKind,
    propertyName,
    useMatchWholeWord,
    useMatchCase,
    toggleUseMatchWholeWord,
    toggleUseMatchCase,
    setSubFlowName,
    setNodeKind,
    setPropertyName,
  ] = useSearchStore(
    useShallow((state) => [
      state.subFlowName,
      state.nodeKind,
      state.propertyName,
      state.useMatchWholeWord,
      state.useMatchCase,
      state.toggleUseMatchWholeWord,
      state.toggleUseMatchCase,
      state.setSubFlowName,
      state.setNodeKind,
      state.setPropertyName,
    ]),
  )

  const {
    data: { flow },
  } = useSuspenseQuery(useQueryAllInFlow())

  const flowList = useMemo(
    () => new CustomFilterList(flow.map(({ name }) => name)),
    [flow],
  )
  const defineList = useMemo(() => new CustomFilterList(defines), [])
  const nodeList = useMemo(() => new CustomFilterList(nodes), [])

  const customFlowList = useMemo(
    () => flowList.search(subFlowName).sort(),
    [flowList, subFlowName],
  )

  const customDefineList = useMemo(
    () => defineList.search(nodeKind).sort(),
    [defineList, nodeKind],
  )

  const customNodeList = useMemo(
    () => nodeList.search(nodeKind).sort(),
    [nodeList, nodeKind],
  )

  useEffect(() => {
    let ignore = false

    let kind = null
    if (nodeKind === '') {
      kind = 'ALL'
    }
    if (defineList.has(nodeKind)) {
      kind = nodeKind.toLowerCase()
    }

    if (nodeList.has(nodeKind)) {
      kind = nodeKind
    }

    if (kind) {
      getNodePropertyByKind(kind).then(setPropertyList)
    } else {
      setPropertyList([])
    }

    return () => {
      ignore = true
    }
  }, [defineList, nodeList, nodeKind])

  return (
    <div className="mt-1 flex flex-col gap-1 pl-6 pr-2 text-xs">
      <>
        Subflow Name
        <NameAutocomplete
          value={subFlowName}
          selectOptions={customFlowList}
          onChange={(value) => setSubFlowName(value)}
        />
      </>
      <>
        Node Type
        <NodeTypeAutocomplete
          value={nodeKind}
          defineOptions={customDefineList}
          nodeOptions={customNodeList}
          onChange={(value) => setNodeKind(value)}
        />
      </>
      <>
        Property Name
        <NameAutocomplete
          value={propertyName}
          selectOptions={propertyList}
          onChange={(value) => setPropertyName(value)}
        />
      </>
      <div className="flex items-center gap-3">
        <Checkbox
          id="matchWholeWord"
          checked={useMatchWholeWord}
          onCheckedChange={toggleUseMatchWholeWord}
        />
        <Label htmlFor="matchWholeWord">Match Whole Word</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="matchCase"
          checked={useMatchCase}
          onCheckedChange={toggleUseMatchCase}
        />
        <Label htmlFor="matchCase">Match Case</Label>
      </div>
    </div>
  )
}
