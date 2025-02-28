import {
  type FitViewOptions,
  type ProOptions,
  type Viewport,
} from '@xyflow/react'

const proOptions: ProOptions = {
  account: 'paid-pro',
  hideAttribution: true,
}

const fitViewOptions: FitViewOptions = {
  minZoom: 0.1,
  maxZoom: 2.0,
}

const viewPort: Viewport = {
  x: 100,
  y: 100,
  zoom: 2.0,
}

const defaultEdgeOptions = {
  style: { strokeWidth: 1, opacity: 0.7 },
}

export { defaultEdgeOptions, fitViewOptions, proOptions, viewPort }
