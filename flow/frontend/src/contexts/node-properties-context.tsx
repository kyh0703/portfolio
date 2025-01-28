'use client'

import useYjsData from '@/hooks/use-yjs-data'
import { useQueryNodeProperty, useUpdateNodeProperty } from '@/services/subflow'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  appendErrors,
  get,
  set,
  type FieldError,
  type FieldErrors,
} from 'react-hook-form'
import * as Yup from 'yup'
import { useYjs } from './yjs-context'

export type FieldValues = Record<string, any>

type NodePropertiesState<TFieldValues extends FieldValues = FieldValues> = {
  id: string
  errors: FieldValues
  property: TFieldValues
  getValues: (path: string) => FieldValues | undefined
  setValue: (path: string, value?: unknown) => void
}

const NodePropertiesContext =
  createContext<NodePropertiesState<FieldValues> | null>(null)

type NodePropertiesProviderProps = {
  subFlowId: number
  nodeId: number
  schema?: Yup.ObjectSchema<FieldValues>
} & PropsWithChildren

export const NodePropertiesProvider = ({
  subFlowId,
  nodeId,
  schema,
  children,
}: NodePropertiesProviderProps) => {
  const { ydoc } = useYjs()
  const { sharedNodePropertiesMap, getNodesMap } = useYjsData(ydoc)
  const nodesMap = getNodesMap(subFlowId)

  const id = useMemo(() => '' + nodeId, [nodeId])
  const [property, setProperty] = useState<FieldValues>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [errors, setErrors] = useState<FieldErrors<FieldValues>>({})
  const { data } = useSuspenseQuery(useQueryNodeProperty<unknown>(nodeId))
  const { mutateAsync } = useUpdateNodeProperty()

  const parseErrorSchema = useCallback(
    (error: Yup.ValidationError, validateAllFieldCriteria: boolean) => {
      return (error.inner || []).reduce<Record<string, FieldError>>(
        (previous, error) => {
          if (!get(previous, error.path!)) {
            set(previous, error.path!, {
              message: error.message,
              type: error.type!,
            })
          }

          if (validateAllFieldCriteria) {
            const fieldError = get(previous, error.path!) as FieldError
            const types = fieldError.types || {}
            const messages = types[error.type!]

            set(
              previous,
              error.path!,
              appendErrors(
                error.path!,
                validateAllFieldCriteria,
                previous,
                error.type!,
                messages
                  ? ([] as string[]).concat(messages as string[], error.message)
                  : error.message,
              ),
            )
          }

          return previous
        },
        {},
      )
    },
    [],
  )

  const validate = useCallback(
    async (values: FieldValues) => {
      if (!schema) {
        setErrors({})
        return
      }
      try {
        await schema.validate(values, { abortEarly: false })
        setErrors({})
      } catch (error: any) {
        if (error.inner) {
          setErrors(parseErrorSchema(error, false))
        } else {
          throw error
        }
      }
    },
    [parseErrorSchema, schema],
  )

  const saveChanges = useCallback(async () => {
    const nodes = Array.from(nodesMap.values())
    if (!nodes.find((node) => node.data.databaseId === nodeId)) {
      return
    }

    const nodeProperty = sharedNodePropertiesMap.get(id)
    try {
      await mutateAsync({ nodeId, nodeProperty })
      setHasUnsavedChanges(false)
    } catch (error) {
      logger.error("Can't save changes", error)
    }
  }, [id, mutateAsync, nodeId, nodesMap, sharedNodePropertiesMap])

  const getValues = useCallback(
    (path: string) => get(property, path),
    [property],
  )

  const setValue = useCallback(
    async (path: string, value?: unknown) => {
      const currentData = sharedNodePropertiesMap.get(id)
      const updateData = { ...currentData }

      try {
        set(updateData, path, value)
        setProperty(updateData)
        sharedNodePropertiesMap.set(id, updateData)
        setHasUnsavedChanges(true)
        if (schema) {
          await validate(updateData)
        }
      } catch (error) {
        logger.error(error)
      }
    },
    [id, schema, sharedNodePropertiesMap, validate],
  )

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      if (hasUnsavedChanges) {
        saveChanges()
      }
    }

    const intervalId = setInterval(() => {
      if (hasUnsavedChanges) {
        saveChanges()
      }
    }, 2000)

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(intervalId)
    }
  }, [hasUnsavedChanges, saveChanges])

  useEffect(() => {
    setProperty(data.property as FieldValues)
    sharedNodePropertiesMap.set(id, data.property as FieldValues)

    const runValidation = async () => {
      if (schema) {
        await validate(data.property as FieldValues)
      }
    }
    runValidation()

    const observer = () => {
      const newData = sharedNodePropertiesMap.get(id)
      setProperty(newData as FieldValues)
      setHasUnsavedChanges(true)
    }
    sharedNodePropertiesMap.observe(observer)

    return () => {
      saveChanges()
      sharedNodePropertiesMap.unobserve(observer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.property, id, nodeId, sharedNodePropertiesMap, saveChanges])

  return (
    <NodePropertiesContext.Provider
      value={{ id, property, errors, getValues, setValue }}
    >
      {children}
    </NodePropertiesContext.Provider>
  )
}

export const useNodePropertiesContext = <
  TFieldValues extends FieldValues = FieldValues,
>() => {
  const context = useContext(NodePropertiesContext)
  if (!context) {
    throw new Error(
      'useNodeProperties must be used within a NodePropertiesProvider',
    )
  }
  return context as NodePropertiesState<TFieldValues>
}
