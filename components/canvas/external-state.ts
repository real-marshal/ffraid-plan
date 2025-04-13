import Konva from 'konva'
import { EntityType } from '@/components/canvas/canvas-state'
import { arrowDimensions, SVGDimensions, triangleDimensions } from '@/components/svg'

export const debug = true

export const width = 600
export const height = 600

export const svgEntityDimensions: Partial<Record<EntityType, SVGDimensions>> = {
  triangle: triangleDimensions,
  arrow: arrowDimensions,
}

interface ExternalState {
  entityRefs: Record<string, Konva.Node | null>
  isInputting: boolean
}

export const externalState: ExternalState = {
  entityRefs: {},
  isInputting: false,
}
