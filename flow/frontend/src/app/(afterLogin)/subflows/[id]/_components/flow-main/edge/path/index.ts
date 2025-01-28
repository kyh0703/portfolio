import { type ControlPointData, type XYPosition } from '@xyflow/react'
import {
  getLinearControlPoints,
  getLinearLabelXY,
  getLinearPath,
} from './linear'

export function getControlPoints(points: (ControlPointData | XYPosition)[]) {
  return getLinearControlPoints(points)
}

export function getPath(points: XYPosition[]) {
  return getLinearPath(points)
}

export function getLabelXY(points: XYPosition[]) {
  return getLinearLabelXY(points)
}
