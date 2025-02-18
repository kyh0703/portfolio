'use client'

import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { useQueryAllInFlow } from '@/services/flow'
import { getNodePropertyByKind } from '@/services/subflow'
import { useUserContext } from '@/store/context'
import { useSearchStore } from '@/store/search'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { filterDefineItem } from '../../define-sidebar/filter'
import { defineItems } from '../../define-sidebar/types'
import CustomFilterList, { nodes } from '../service/custom-filter-list'
import NameAutocomplete from './name-autocomplete'
import NodeTypeAutocomplete from './node-type-autocomplete'

export default function SearchFilter() {
  const { type: flowType, mode: flowMode } = useUserContext()
  const [propertyList, setPropertyList] = useState<string[]>([])
  const [
    options,
    toggleUseMatchWholeWord,
    toggleUseMatchCase,
    setSubFlowName,
    setNodeKind,
    setPropertyName,
  ] = useSearchStore(
    useShallow((state) => [
      state.options,
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

  const filteredDefineItems = useMemo(
    () => [
      ...new Set(
        defineItems
          .filter((item) =>
            filterDefineItem(item, {
              flowType,
              flowMode,
            }),
          )
          .map((item) => item.name),
      ),
    ],
    [flowMode, flowType],
  )

  const flowList = useMemo(
    () => new CustomFilterList(flow.map(({ name }) => name)),
    [flow],
  )
  const defineList = useMemo(
    () => new CustomFilterList(filteredDefineItems),
    [filteredDefineItems],
  )
  const nodeList = useMemo(() => new CustomFilterList(nodes), [])

  const customFlowList = useMemo(
    () => flowList.search(options.subFlowName).sort(),
    [flowList, options.subFlowName],
  )

  const customDefineList = useMemo(
    () => defineList.search(options.nodeKind).sort(),
    [defineList, options.nodeKind],
  )

  const customNodeList = useMemo(
    () => nodeList.search(options.nodeKind).sort(),
    [nodeList, options.nodeKind],
  )

  const customPropertyList = useMemo(
    () =>
      options.propertyName
        ? propertyList.filter((property) =>
            property.toLowerCase().includes(options.propertyName.toLowerCase()),
          )
        : propertyList,
    [propertyList, options.propertyName],
  )

  useEffect(() => {
    let ignore = false

    let kind = null
    if (options.nodeKind === '') {
      kind = 'ALL'
    }
    if (defineList.has(options.nodeKind)) {
      kind = options.nodeKind.toLowerCase()
    }

    if (nodeList.has(options.nodeKind)) {
      kind = options.nodeKind
    }

    if (kind) {
      getNodePropertyByKind(kind).then(setPropertyList)
    }

    return () => {
      ignore = true
    }
  }, [defineList, nodeList, options.nodeKind])

  return (
    <div className="mt-1 flex flex-col gap-1 pl-6 pr-2 text-xs">
      <>
        Subflow Name
        <NameAutocomplete
          value={options.subFlowName}
          selectOptions={customFlowList}
          onChange={(value) => setSubFlowName(value)}
        />
      </>
      <>
        Node Type
        <NodeTypeAutocomplete
          value={options.nodeKind}
          defineOptions={customDefineList}
          nodeOptions={customNodeList}
          onChange={(value) => setNodeKind(value)}
        />
      </>
      <>
        Property Name
        <NameAutocomplete
          value={options.propertyName}
          selectOptions={customPropertyList}
          onChange={(value) => setPropertyName(value)}
        />
      </>
      <div className="flex items-center gap-3">
        <Checkbox
          id="matchWholeWord"
          checked={options.useMatchWholeWord}
          onCheckedChange={toggleUseMatchWholeWord}
        />
        <Label htmlFor="matchWholeWord">Match Whole Word</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="matchCase"
          checked={options.useMatchCase}
          onCheckedChange={toggleUseMatchCase}
        />
        <Label htmlFor="matchCase">Match Case</Label>
      </div>
    </div>
  )
}
