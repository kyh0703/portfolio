import type {
  ManagedGridOptionKey,
  RowNodeTransaction,
} from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEventHandler,
  type RefObject,
} from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

type GridOptions<T> = {
  data?: T[]
  onRowChanged?: (rowData: T[]) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onCopy?: () => void
  onPaste?: () => void
  onCut?: () => void
  onRemove?: () => void
}

export default function useGridHook<T>(
  ref: RefObject<AgGridReact<T>> | null,
  options?: GridOptions<T>,
) {
  const [rowData, setRowData] = useState<T[]>([])
  const [selectedRow, setSelectedRow] = useState<T[]>([])

  const syncStateByTx = useCallback(
    (txResult?: RowNodeTransaction<T> | null) => {
      if (!txResult) {
        return
      }

      if (txResult.add) {
        setRowData((prev) => [
          ...prev,
          ...txResult.add.map((row) => row.data as T),
        ])

        if (options?.onRowChanged) {
          options.onRowChanged(rowData)
        }
      }
      if (txResult.update) {
        setRowData((prev) => {
          const updatedData = [...prev]
          txResult.update.forEach((row) => {
            const index = updatedData.findIndex((data) => data === row.data)
            if (index !== -1) return
            updatedData[index] = row.data as T
          })
          return updatedData
        })

        if (options?.onRowChanged) {
          options.onRowChanged(rowData)
        }
      }
      if (txResult.remove) {
        const removeRows = txResult.remove.map((row) => row.data)
        setRowData((prevData) =>
          prevData.filter((row) => !removeRows.includes(row)),
        )

        if (options?.onRowChanged) {
          options.onRowChanged(rowData)
        }
      }
    },
    [options, rowData],
  )

  const getRows = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return []
    }
    let rowData: T[] = []
    api.forEachNode((node) => node.data && rowData.push(node.data))
    return rowData
  }, [ref])

  const setRows = useCallback(
    (rowData: T[]) => {
      const api = ref?.current?.api
      if (!api) {
        return
      }

      api.setGridOption('rowData', rowData)
      setRowData(rowData)

      if (options?.onRowChanged) {
        options?.onRowChanged(rowData)
      }
    },
    [options, ref],
  )

  const selectAll = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return []
    }
    api.selectAll()
  }, [ref])

  const deselectAll = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return []
    }
    api.deselectAll()
  }, [ref])

  const getSelectedRow = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    return api.getSelectedNodes()[0]
  }, [ref])

  const getSelectedRows = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    return api.getSelectedNodes()
  }, [ref])

  const addRow = useCallback(
    (newRow: T, addIndex?: number) => {
      const api = ref?.current?.api
      if (!api) {
        return
      }
      const rowCount = ref.current.api.getDisplayedRowCount()
      const txResult = api.applyTransaction({
        add: [newRow],
        addIndex: addIndex ?? rowCount,
      })
      syncStateByTx(txResult)
    },
    [ref, syncStateByTx],
  )

  const addRows = useCallback(
    (rowData: T[]) => {
      const api = ref?.current?.api
      if (!api) {
        return
      }
      return api.setGridOption('rowData', rowData)
    },
    [ref],
  )

  const updateRowByRowIndex = useCallback(
    (updatedRow: T, rowIndex?: number | null) => {
      const api = ref?.current?.api
      if (!api) {
        return
      }

      const allRows = []
      api.forEachNode((rowNode) => {
        allRows.push(rowNode.data)
      })

      if (rowIndex !== undefined && rowIndex !== null) {
        allRows[rowIndex] = updatedRow
      }

      api.setGridOption('rowData', allRows)

      const txResult: RowNodeTransaction<T> = {
        update: [updatedRow as any],
        add: [],
        remove: [],
      }
      syncStateByTx(txResult)
    },
    [ref, syncStateByTx],
  )

  const removeSelectedRows = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    const selectedRows = api.getSelectedRows()
    const txResult = api.applyTransaction({ remove: selectedRows })
    syncStateByTx(txResult)
    return txResult
  }, [ref, syncStateByTx])

  const clearRows = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return []
    }
    const rowData = getRows()
    const txResult = api.applyTransaction({ remove: rowData })!
    syncStateByTx(txResult)
    return txResult
  }, [getRows, ref, syncStateByTx])

  const clearSelectedRows = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return []
    }
    const rowData = getRows()
    const txResult = api.applyTransaction({ remove: rowData })
    syncStateByTx(txResult)
    return txResult
  }, [getRows, ref, syncStateByTx])

  const canRemove = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    return api.getSelectedRows().length > 0
  }, [ref])

  const exportExcel = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    api.exportDataAsExcel()
  }, [ref])

  const importExcel = useCallback(
    (
      columns: Record<string, string>,
      event: ChangeEvent<HTMLInputElement>,
    ): Promise<any[]> => {
      const api = ref?.current?.api
      if (!api) {
        return Promise.resolve([])
      }

      const file = event.target.files?.[0]
      if (!file) {
        return Promise.resolve([])
      }

      const rowData: any[] = []
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)

      return new Promise((resolve, reject) => {
        reader.onload = (event: ProgressEvent<FileReader>) => {
          try {
            const data = new Uint8Array(event.target?.result as ArrayBuffer)
            const arr = []
            for (let i = 0; i != data.length; ++i) {
              arr[i] = String.fromCharCode(data[i])
            }
            const bstr = arr.join('')
            const workbook = XLSX.read(bstr, { type: 'binary' })

            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]

            let rowIndex = 2
            while (worksheet['A' + rowIndex]) {
              let row: any = {}
              Object.keys(columns).forEach(
                (column) =>
                  (row[columns[column]] = worksheet[column + rowIndex].w),
              )
              rowData.push(row)
              rowIndex++
            }
            resolve(rowData)
          } catch (error) {
            reject(error)
          }
        }

        reader.onerror = (error) => {
          reject(error)
        }
      })
    },
    [ref],
  )

  const cut = useCallback(() => {
    setSelectedRow(removeSelectedRows()?.remove.map((row) => row.data!) || [])
  }, [removeSelectedRows])

  const copy = useCallback(() => {
    const selectedRows = getSelectedRows()
    setSelectedRow(selectedRows?.map((row) => row.data!) || [])
  }, [getSelectedRows])

  const paste = useCallback(() => {
    selectedRow.map((row) => addRow(row))
  }, [addRow, selectedRow])

  const remove = useCallback(() => {
    removeSelectedRows()
  }, [removeSelectedRows])

  const onRowDragEnd = useCallback(() => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    setRows(getRows())
  }, [getRows, ref, setRows])

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      try {
        if (options?.onKeyDown) {
          options.onKeyDown(event)
        }

        switch (event.key) {
          case 'a':
            if (event.ctrlKey || event.metaKey) {
              selectedRow.length === getRows().length
                ? deselectAll()
                : selectAll()
            }
            break
          case 'x':
            if (event.ctrlKey || event.metaKey) {
              if (options?.onCut) {
                options.onCut()
              } else {
                cut()
              }
            }
            break
          case 'c':
            if (event.ctrlKey || event.metaKey) {
              if (options?.onCopy) {
                options.onCopy()
              } else {
                copy()
              }
            }
            break
          case 'v':
            if (event.ctrlKey || event.metaKey) {
              if (options?.onPaste) {
                options.onPaste()
              } else {
                paste()
              }
            }
            break
          case 'Delete':
            if (options?.onRemove) {
              options.onRemove()
            } else {
              remove()
            }
            break
        }
      } catch (e) {
        if (e instanceof Error) {
          e.message && toast.warn(e.message)
        }
      }
    },
    [
      copy,
      cut,
      deselectAll,
      getRows,
      options,
      paste,
      remove,
      selectAll,
      selectedRow.length,
    ],
  )

  const onFilterChanged = (option: ManagedGridOptionKey, search: string) => {
    const api = ref?.current?.api
    if (!api) return
    api.setGridOption(option, search)
  }

  useEffect(() => {
    setRowData(options?.data || [])
  }, [options?.data])

  return {
    rowData,
    setRowData,
    getRows,
    setRows,
    selectAll,
    deselectAll,
    getSelectedRow,
    getSelectedRows,
    addRow,
    addRows,
    updateRowByRowIndex,
    removeSelectedRows,
    clearSelectedRows,
    clearRows,
    canRemove,
    exportExcel,
    importExcel,
    cut,
    copy,
    paste,
    remove,
    onRowDragEnd,
    onKeyDown,
    onFilterChanged,
  }
}
