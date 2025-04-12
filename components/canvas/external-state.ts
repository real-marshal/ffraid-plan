import Konva from 'konva'

export const debug = true

export const width = 600
export const height = 600

interface ExternalState {
  entityRefs: Record<string, Konva.Node | null>
  isInputting: boolean
}

export const externalState: ExternalState = {
  entityRefs: {},
  isInputting: false,
}
