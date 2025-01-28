'use client'

import { AgGridReact } from 'ag-grid-react'
import { forwardRef } from 'react'
import {
  useForm,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Form, FormField } from '../form'
import Grid, { type GridProps } from '../grid'

export type FormGridProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
} & GridProps

const FormGrid = <T extends FieldValues>(
  props: FormGridProps<T>,
  ref: React.ForwardedRef<AgGridReact>,
) => {
  const { control, name, ...rest } = props
  const methods = useForm<T>()

  return (
    <Form {...methods}>
      <FormField
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Grid
            ref={ref}
            {...rest}
            onGridReady={(event) => {
              event.api.setGridOption('rowData', value)
            }}
            onRowDragEnd={(event) => {
              let rowData: any[] = []
              event.api.forEachNode(
                (node) => node.data && rowData.push(node.data),
              )
              onChange(rowData)
            }}
            onRowDataUpdated={(event) => {
              let rowData: any[] = []
              event.api.forEachNode(
                (node) => node.data && rowData.push(node.data),
              )
              onChange(rowData)
            }}
          />
        )}
      />
    </Form>
  )
}

const ForwardedFormGrid = forwardRef(FormGrid) as <T extends FieldValues>(
  props: FormGridProps<T> & { ref?: React.ForwardedRef<AgGridReact> },
) => ReturnType<typeof FormGrid>

export default ForwardedFormGrid
