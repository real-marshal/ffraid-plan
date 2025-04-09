import { enableMapSet, produce } from 'immer'
import { isObjEmpty } from '@/utils'
import Konva from 'konva'

enableMapSet()

export interface Entity {
  id: string
  type: 'melee' | 'ranged' | 'healer' | 'tank' | 'rect' | 'circle'
  initialParams: EntityParams
}

export interface EntityParams {
  x?: number
  y?: number
  color?: string
  fill?: string
  opacity: number
}

export interface Tw {
  beginTime: number
  endTime: number
  tween: Konva.Tween
  value: number | string
}

export type EntityParamName = keyof EntityParams

export type Kf = Record<string, Partial<EntityParams>>

export type Keyframes = Map<number, Kf>

interface CoreState {
  entities: Entity[]
  selectedEntityInd?: number
  keyframes: Keyframes
  keyframesByEntity: Record<
    string,
    Partial<Record<EntityParamName, { time: number; value: number | string }[]>>
  >
  currentTime: number
}

export type CoreAction =
  | { type: 'reset' }
  | { type: 'select_entity'; id: string }
  | { type: 'deselect_entity' }
  | { type: 'add_entity'; entity: Entity }
  | { type: 'delete_entity'; id: string }
  | { type: 'set_entity_param'; id: string; param: EntityParamName; value: number | string }
  | { type: 'set_kf'; entityId: string; param: EntityParamName }
  | { type: 'remove_kf'; entityId: string; param: EntityParamName }
  | { type: 'set_time'; time: number }

// module-level state not controlled by react
// useful for non-reactive dom things so that immer doesn't freak out and omit internal properties
interface ExternalState {
  entityRefs: Record<string, Konva.Node | null>
  tweensByEntity: Record<string, Partial<Record<EntityParamName, Tw[]>>>
  tweensByBeginTime: Map<number, Tw[]>
}

export const initialState = {
  entities: [],
  selectedEntityInd: undefined,
  keyframes: new Map(),
  keyframesByEntity: {},
  currentTime: 0,
}

export const externalState: ExternalState = {
  entityRefs: {},
  tweensByEntity: {},
  tweensByBeginTime: new Map(),
}

const shouldLogStateChanges = true

export function coreReducer(state: CoreState, action: CoreAction): CoreState {
  if (shouldLogStateChanges) {
    console.log(state)
  }

  switch (action.type) {
    case 'reset': {
      return initialState
    }
    case 'select_entity': {
      return produce(state, (draft) => {
        draft.selectedEntityInd = draft.entities.findIndex((e) => e.id === action.id)
      })
    }
    case 'deselect_entity': {
      return produce(state, (draft) => {
        draft.selectedEntityInd = undefined
      })
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
      })
    }
    case 'set_entity_param': {
      return produce(state, (draft) => {
        const entity = draft.entities.find((e) => e.id === action.id)
        if (!entity) throw new Error('No entity with id ' + action.id)

        const currentTimeKf = draft.keyframes.get(draft.currentTime)
        const entityKf = currentTimeKf?.[entity.id]

        // already has kf
        if (entityKf && action.param in entityKf) {
          // @ts-expect-error kys dumbass, i know better
          entityKf[action.param] = action.value

          draft.keyframesByEntity[entity.id][action.param]!.find(
            (pKf) => pKf.time === draft.currentTime
          )!.value = action.value

          updateTweenValue(state, entity.id, action.param, action.value)
          // auto kf makes no sense for point 0
        } else if (draft.currentTime === 0) {
          // @ts-expect-error kys dumbass, i know better
          entity.initialParams[action.param] = action.value
          // auto kf
        } else {
          draft.keyframesByEntity[entity.id] ??= {}
          draft.keyframesByEntity[entity.id][action.param] ??= []
          draft.keyframesByEntity[entity.id][action.param]!.push({
            time: draft.currentTime,
            value: action.value,
          })
          draft.keyframesByEntity[entity.id][action.param]!.sort((a, b) => a.time - b.time)

          if (!currentTimeKf) {
            draft.keyframes.set(draft.currentTime, {
              [action.id]: { [action.param]: action.value },
            })
            createTween(state, entity.id, action.param, action.value)
            return
          }

          currentTimeKf[action.id] ??= {}
          // @ts-expect-error kys dumbass, i know better
          currentTimeKf[action.id][action.param] = action.value

          createTween(state, entity.id, action.param, action.value)
        }
      })
    }
    case 'set_kf': {
      return produce(state, (draft) => {
        const entity = draft.entities.find((e) => e.id === action.entityId)
        if (!entity) throw new Error('No entity with id ' + action.entityId)

        const value = entity.initialParams[action.param]

        if (value === undefined) {
          throw new Error('Initial value for this prop was undefined')
        }

        const currentKf = draft.keyframes.get(draft.currentTime)

        if (currentKf) {
          currentKf[action.entityId] ??= {}
          // @ts-expect-error kys dumbass, i know better
          currentKf[action.entityId][action.param] = value
        } else {
          draft.keyframes.set(draft.currentTime, {
            [action.entityId]: { [action.param]: value },
          })
        }

        draft.keyframesByEntity[entity.id] ??= {}
        draft.keyframesByEntity[entity.id][action.param] ??= []
        draft.keyframesByEntity[entity.id][action.param]!.push({
          time: draft.currentTime,
          value: value,
        })
        draft.keyframesByEntity[entity.id][action.param]!.sort((a, b) => a.time - b.time)

        createTween(state, action.entityId, action.param, value)
      })
    }
    case 'remove_kf': {
      return produce(state, (draft) => {
        const entity = draft.entities.find((e) => e.id === action.entityId)
        if (!entity) throw new Error('No entity with id ' + action.entityId)

        delete draft.keyframes.get(draft.currentTime)![action.entityId][action.param]

        if (isObjEmpty(draft.keyframes.get(draft.currentTime)![action.entityId])) {
          delete draft.keyframes.get(draft.currentTime)![action.entityId]
        }

        if (isObjEmpty(draft.keyframes.get(draft.currentTime))) {
          draft.keyframes.delete(draft.currentTime)
        }

        const pKfIndToDelete = draft.keyframesByEntity[entity.id][action.param]!.findIndex(
          (pKf) => pKf.time === draft.currentTime
        )!
        draft.keyframesByEntity[entity.id][action.param]!.splice(pKfIndToDelete, 1)

        if (!draft.keyframesByEntity[entity.id][action.param]!.length) {
          delete draft.keyframesByEntity[entity.id][action.param]
        }

        if (isObjEmpty(draft.keyframesByEntity[entity.id])) {
          delete draft.keyframesByEntity[entity.id]
        }

        removeTween(state, entity.id, action.param)
      })
    }
    case 'set_time': {
      return produce(state, (draft) => {
        draft.currentTime = action.time
      })
    }
  }
}

export function selectSelectedEntity({
  selectedEntityInd,
  entities,
}: CoreState): Entity | undefined {
  return selectedEntityInd !== undefined ? entities[selectedEntityInd] : undefined
}

export function selectEntityParams(state: CoreState, id: string): EntityParams {
  const entity = state.entities.find((e) => e.id === id)

  if (!entity) throw new Error(`No entity with id ${id}`)

  return {
    ...entity.initialParams,
    ...state.keyframes.get(state.currentTime)?.[id],
  }
}

export function selectSelectedEntityParams(state: CoreState): EntityParams {
  const selectedEntity = selectSelectedEntity(state)

  if (!selectedEntity) throw new Error('No entity selected')

  return selectEntityParams(state, selectedEntity.id)
}

function updateTweenValue(
  { keyframesByEntity, currentTime }: CoreState,
  entityId: string,
  param: EntityParamName,
  value: number | string
) {
  if (!externalState.entityRefs[entityId]) throw new Error('No ref found')

  const prevKf = keyframesByEntity[entityId][param]?.find((pKf) => pKf.time < currentTime)

  if (!prevKf) {
    // first kf doesn't have a tween
    return
  }

  const duration = currentTime - prevKf.time

  const tw = externalState.tweensByEntity[entityId][param]!.find(
    (tw) => tw.endTime === currentTime
  )!
  const newTween = new Konva.Tween({
    node: externalState.entityRefs[entityId]!,
    duration,
    [param]: value,
    easing: Konva.Easings.Linear,
  })

  const tweensByBeginTime = externalState.tweensByBeginTime.get(tw.beginTime)!
  const tweenByBeginTime = tweensByBeginTime.find((twToFind) => (twToFind.tween = tw.tween))!

  tw.tween = newTween
  tw.value = value

  tweenByBeginTime.tween = newTween
  tweenByBeginTime.value = value
}

function createTween(
  { keyframesByEntity, currentTime }: CoreState,
  entityId: string,
  param: EntityParamName,
  value: number | string
) {
  if (!externalState.entityRefs[entityId]) throw new Error('No ref found')

  const prevKf = keyframesByEntity[entityId]?.[param]?.find((pKf) => pKf.time < currentTime)

  if (!prevKf) {
    // first kf doesn't have a tween
    return
  }

  const duration = currentTime - prevKf.time

  const tw = {
    beginTime: prevKf.time,
    endTime: currentTime,
    tween: new Konva.Tween({
      node: externalState.entityRefs[entityId]!,
      duration,
      [param]: value,
      easing: Konva.Easings.Linear,
    }),
    value,
  }

  externalState.tweensByEntity[entityId] ??= {}
  externalState.tweensByEntity[entityId][param] ??= []

  externalState.tweensByEntity[entityId][param].push(tw)

  externalState.tweensByBeginTime.set(prevKf.time, [
    ...(externalState.tweensByBeginTime.get(prevKf.time) ?? []),
    tw,
  ])
}

function removeTween({ currentTime }: CoreState, entityId: string, param: EntityParamName) {
  if (!externalState.entityRefs[entityId]) throw new Error('No ref found')

  const paramTw = externalState.tweensByEntity[entityId][param]!

  const ind = paramTw.findIndex((tw) => tw.endTime === currentTime)!

  // tried to remove non-existent first kf tween
  if (ind === -1) {
    return
  }

  const [twToRemove] = paramTw.splice(ind, 1)

  // tween is on a kf between other kf's requiring a duration change for the next tween
  if (ind > 0 && ind < paramTw.length - 1) {
    const nextTw = paramTw[ind + 1]

    nextTw.tween = new Konva.Tween({
      node: externalState.entityRefs[entityId]!,
      duration: nextTw.endTime - twToRemove.beginTime,
      [param]: twToRemove,
      easing: Konva.Easings.Linear,
    })
    nextTw.beginTime = twToRemove.beginTime
  }

  const tweensByBeginTime = externalState.tweensByBeginTime.get(twToRemove.beginTime)!
  const indToRemove = tweensByBeginTime.findIndex((tw) => tw.tween !== twToRemove.tween)
  tweensByBeginTime.splice(indToRemove, 1)

  if (!tweensByBeginTime.length) {
    externalState.tweensByBeginTime.delete(twToRemove.beginTime)
  }
}
