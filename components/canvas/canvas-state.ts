import { enableMapSet, produce } from 'immer'
import { nanoid } from 'nanoid'
import { debug } from '@/components/canvas/external-state'

enableMapSet()

export interface Entity {
  id: string
  type: 'melee' | 'ranged' | 'healer' | 'tank' | 'rect' | 'circle' | 'arrow' | 'triangle' | 'ring'
  selectable: boolean
  props: EntityProps
}

export interface EntityProps {
  opacity: number
  x: number
  y: number
  width?: number
  height?: number
  color?: string
  fill?: string
  radius?: number
  rotation?: number
  stroke?: string
  scaleX?: number
  scaleY?: number
  image?: string
  data?: string
  innerRadius?: number
  outerRadius?: number
}

export type EntityPropName = keyof EntityProps

export interface Kf {
  id: string
  entityId: string
  time: number
  prop: EntityPropName
  value: number | string
}

export type KfGroup = { id: string; kfs: Kf[] }

export type KfsByTime = Record<number, KfGroup>

export type KfsByEntity = Record<string, Record<EntityPropName, Kf[]>>

export interface CoreState {
  entities: Entity[]
  // keyframe data source of truth, the only one to be modified directly
  keyframes: Kf[]
  // // a materialized view for keyframes
  keyframesByEntity: KfsByEntity
  keyframesByTime: KfsByTime
}

export type CoreAction =
  | { type: 'reset' }
  | { type: 'replace_state'; newState: CoreState }
  | { type: 'add_entity'; entity: Entity }
  | { type: 'delete_entity'; id: string }
  | { type: 'toggle_selectable'; id: string }
  | {
      type: 'set_entity_param'
      id: string
      param: EntityPropName
      value: number | string
      currentTime: number
      autoKf: boolean
      updateKf: boolean
    }
  | { type: 'set_kf'; entityId: string; param: EntityPropName; currentTime: number }
  | { type: 'remove_kf'; entityId: string; param: EntityPropName; currentTime: number }
  | { type: 'move_kf'; time: number; newTime: number }

export const initialState = {
  entities: [],
  keyframes: [],
  keyframesByTime: {},
  keyframesByEntity: {},
}

export function coreReducer(state: CoreState, action: CoreAction): CoreState {
  if (debug) {
    console.log('state change from:')
    console.log(state)
  }

  switch (action.type) {
    case 'reset': {
      return initialState
    }
    case 'replace_state': {
      return {
        ...action.newState,
        keyframesByEntity: generateKfsByEntity(action.newState.keyframes),
      }
    }
    case 'add_entity': {
      return produce(state, (draft) => {
        draft.entities.push(action.entity)
      })
    }
    case 'delete_entity': {
      return produce(state, (draft) => {
        const ind = draft.entities.findIndex((e) => e.id === action.id)
        if (ind !== -1) draft.entities.splice(ind, 1)

        draft.keyframes = draft.keyframes.filter((kf) => kf.entityId !== action.id)
        draft.keyframesByEntity = generateKfsByEntity(draft.keyframes)
      })
    }
    case 'toggle_selectable': {
      return produce(state, (draft) => {
        const entity = draft.entities.find((e) => e.id === action.id)
        if (!entity) throw new Error('No entity with id ' + action.id)

        entity.selectable = !entity.selectable
      })
    }
    case 'set_entity_param': {
      console.log(action.param + ' ' + action.value)
      return produce(state, (draft) => {
        const entity = draft.entities.find((e) => e.id === action.id)
        if (!entity) throw new Error('No entity with id ' + action.id)

        // @ts-expect-error how the hell do you use generics with actions?
        entity.props[action.param] = action.value

        if (!action.updateKf) return

        const currentKf = draft.keyframes.find(
          (kf) =>
            kf.time === action.currentTime && kf.entityId === action.id && kf.prop === action.param
        )

        if (currentKf) {
          currentKf.value = action.value
          draft.keyframesByEntity = generateKfsByEntity(draft.keyframes)
          return
        }

        if (action.autoKf && draft.keyframesByEntity[action.id]?.[action.param]?.length) {
          draft.keyframes.push({
            id: nanoid(4),
            entityId: action.id,
            prop: action.param,
            time: action.currentTime,
            value: action.value,
          })
          draft.keyframesByEntity = generateKfsByEntity(draft.keyframes)
        }
      })
    }
    case 'set_kf': {
      return produce(state, (draft) => {
        const entity = draft.entities.find((e) => e.id === action.entityId)
        if (!entity) throw new Error('No entity with id ' + action.entityId)

        const value = entity.props[action.param]!

        draft.keyframes.push({
          id: nanoid(4),
          entityId: action.entityId,
          prop: action.param,
          time: action.currentTime,
          value,
        })

        draft.keyframesByEntity = generateKfsByEntity(draft.keyframes)
      })
    }
    case 'remove_kf': {
      return produce(state, (draft) => {
        const indToRemove = draft.keyframes.findIndex(
          (kf) =>
            kf.time === action.currentTime &&
            kf.entityId === action.entityId &&
            kf.prop === action.param
        )

        draft.keyframes.splice(indToRemove, 1)

        draft.keyframesByEntity = generateKfsByEntity(draft.keyframes)
      })
    }
    case 'move_kf': {
      return produce(state, (draft) => {
        draft.keyframes
          .filter((kf) => kf.time === action.time)
          .forEach((kf) => (kf.time = action.newTime))

        draft.keyframesByEntity = generateKfsByEntity(draft.keyframes)
      })
    }
  }
}

function generateKfsByEntity(keyframes: Kf[]): KfsByEntity {
  const kfs: KfsByEntity = {}

  const kfedEntities = new Set(keyframes.map((kf) => kf.entityId))

  for (const entityId of kfedEntities) {
    const entityKfs = keyframes
      .filter((kf) => kf.entityId === entityId)
      .sort((a, b) => a.time - b.time)

    kfs[entityId] = entityKfs.reduce(
      (result, kf) => ({
        ...result,
        [kf.prop]: [...(result[kf.prop] ?? []), kf],
      }),
      {} as Record<EntityPropName, Kf[]>
    )
  }

  return kfs
}
