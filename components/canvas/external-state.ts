import Konva from 'konva'

interface ExternalState {
  entityRefs: Record<string, Konva.Node | null>
}

export const externalState: ExternalState = {
  entityRefs: {},
}
