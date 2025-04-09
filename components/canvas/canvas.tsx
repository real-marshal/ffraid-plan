'use client'

// shouldn't be applied to canvas images
/* eslint-disable jsx-a11y/alt-text */

import { Circle, Layer, Stage, Image, Rect } from 'react-konva'
import { memo, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ArenaPicker } from '@/components/arena-picker'
import { Menu } from '@/components/menu'
import { VerticalMenu } from '@/components/vertical-menu'
import { ContextMenu } from '@/components/context-menu'
import { Timeline } from '@/components/timeline'
import { lerp } from '@/utils'
import { EntityList } from '@/components/entity-list'
import { EntityProps, entityTypeToProps } from '@/components/entity-props'
import { useKonvaContextMenu } from '@/hooks/use-konva-context-menu'
import { makeEntity } from './canvas-utils'
import {
  CoreAction,
  coreReducer,
  Entity,
  EntityParams,
  externalState,
  initialState,
  Kf,
  selectEntityParams,
  selectSelectedEntity,
  selectSelectedEntityParams,
  Tw,
} from './canvas-state'
import Konva from 'konva'
import { usePrev } from '@react-spring/shared'

// function getInterpolatedParamValue(
//   entityId: string,
//   param: 'x' | 'y',
//   sortedKeyframePairs: [number, Kf][],
//   currentTime: number
// ): unknown {
//   const prevKfInd = sortedKeyframePairs.findLastIndex(
//     ([kfTime, kf]) => kfTime < currentTime && kf[entityId] && param in kf[entityId]
//   )
//   const nextKfInd = sortedKeyframePairs.findIndex(
//     ([kfTime, kf]) => kfTime > currentTime && kf[entityId] && param in kf[entityId]
//   )
//
//   if (nextKfInd === -1) return
//
//   if (prevKfInd === -1) {
//     return alert('The first keyframe unexpectedly disappeared somewhere')
//   }
//
//   const [prevKfTime, prevKf] = sortedKeyframePairs[prevKfInd]
//   const [nextKfTime, nextKf] = sortedKeyframePairs[nextKfInd]
//
//   // ! because existence is checked in prevKfInd/nextKfInd searches
//   return lerp(
//     prevKf[entityId][param]!,
//     nextKf[entityId][param]!,
//     (currentTime - prevKfTime) / (nextKfTime - prevKfTime)
//   )
// }

export const width = 600
export const height = 600

export function Canvas() {
  const [arena, setArena] = useState<ImageBitmap>()

  const { contextMenuState, onContextMenu } = useKonvaContextMenu()

  const [state, dispatch] = useReducer(coreReducer, initialState)
  const { entities, selectedEntityInd, keyframes, currentTime } = state
  const selectedEntity = selectSelectedEntity(state)
  // const sortedKeyframeEntries = useMemo(
  //   () => [...keyframes.entries()].sort(([a], [b]) => a - b),
  //   [keyframes]
  // )

  const [isPlaying, setIsPlaying] = useState(false)
  const playerInterval = useRef<number | null>(null)

  // this is kind of a dirty solution but well..
  // the original problem is that you can't pass a callback to dispatch like with useState
  // which caused updates to currentTime to be non-atomic breaking reactivity
  // at the same time, moving currentTime out of the reducer means heavily complicating
  // both the reducer and all selectors
  // so in the end, i decided to just have this separate time value for the interval for the time being
  const [intervalTime, setIntervalTime] = useState(0)

  useEffect(() => {
    dispatch({ type: 'set_time', time: intervalTime })

    const tweens = externalState.tweensByBeginTime.get(intervalTime)

    tweens?.forEach((tw) => {
      tw.tween.reset()
      tw.tween.play()
    })
  }, [intervalTime])

  return (
    <div className='grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr_1fr]'>
      {selectedEntity && (
        <EntityProps
          className='col-start-1 row-start-1 row-span-3'
          entity={selectedEntity}
          values={selectSelectedEntityParams(state)}
          onPropChange={(propName, value) => {
            console.log(`dispatch with ${propName} new value ${value}`)
            dispatch({
              type: 'set_entity_param',
              id: selectedEntity.id,
              param: propName,
              value,
            })
          }}
          onKf={(param) =>
            param in (keyframes.get(currentTime)?.[selectedEntity.id] ?? {})
              ? dispatch({ type: 'remove_kf', entityId: selectedEntity.id, param })
              : dispatch({ type: 'set_kf', entityId: selectedEntity.id, param })
          }
          currentTime={currentTime}
          keyframes={keyframes}
        />
      )}
      <Menu className='col-start-2' onClear={() => dispatch({ type: 'reset' })} />
      <VerticalMenu
        className='col-start-1 row-start-2 self-end justify-self-end'
        onMeleeAdd={() => dispatch({ type: 'add_entity', entity: makeEntity('melee') })}
        onRangedAdd={() => dispatch({ type: 'add_entity', entity: makeEntity('ranged') })}
        onHealerAdd={() => dispatch({ type: 'add_entity', entity: makeEntity('healer') })}
        onTankAdd={() => dispatch({ type: 'add_entity', entity: makeEntity('tank') })}
        onRectAdd={() => dispatch({ type: 'add_entity', entity: makeEntity('rect') })}
      />
      <div
        className={`col-start-2 row-start-2 justify-center relative w-[${width}px] h-[${height}px]`}
        data-theme='dark'
      >
        <Stage
          width={width}
          height={height}
          className='bg-gray-600'
          onClick={() => dispatch({ type: 'deselect_entity' })}
        >
          <Layer>
            <Image image={arena} width={width} height={height} />
          </Layer>
          <Layer>
            <Circle x={0} y={0} radius={50} fill='red' />
            <MemoedEntities entities={entities} onContextMenu={onContextMenu} dispatch={dispatch} />
          </Layer>
        </Stage>
        {!arena && <ArenaPicker onPick={(arena) => setArena(arena)} />}
        {contextMenuState.isShown && (
          <ContextMenu
            style={{
              left: contextMenuState.x,
              top: contextMenuState.y,
            }}
            onDelete={() => dispatch({ type: 'delete_entity', id: contextMenuState.targetId! })}
          />
        )}
      </div>
      <Timeline
        onTimeChange={(time) => {
          // const prevTweens = [...externalState.tweensByBeginTime.keys()]
          //   .sort((a, b) => a - b)
          //   .filter((tw) => tw < currentTime)
          const twsToRun: Tw[] = []

          Object.values(externalState.tweensByEntity).forEach((paramTweens) => {
            Object.entries(paramTweens).forEach(([paramName, tws]) => {
              const tw = tws
                .sort((a, b) => a.beginTime - b.beginTime)
                .findLast((tw) => tw.beginTime <= time && tw.endTime >= time)

              if (tw) {
                twsToRun.push(tw)
              }
            })
          })
          twsToRun.forEach((tw) => {
            tw.tween.seek(lerp(tw.beginTime, tw.endTime, time - tw.beginTime))
          })
          console.log(time)
        }}
        isPlaying={isPlaying}
        onPlay={(duration) => {
          setIsPlaying(true)
          playerInterval.current = window.setInterval(() => {
            console.log('int')
            setIntervalTime((time) => Math.round((time >= duration ? 0 : time + 0.1) * 10) / 10)
            // this doesn't work
            // dispatch({ type: 'set_time', time: currentTime >= duration ? 0 : currentTime + 0.1 })
          }, 100)
        }}
        onPause={() => {
          setIsPlaying(false)

          if (playerInterval.current) {
            window.clearInterval(playerInterval.current)
          }
        }}
        keyframes={keyframes}
        currentTime={currentTime}
        setCurrentTime={(currentTime) => dispatch({ type: 'set_time', time: currentTime })}
      />
      <EntityList
        entities={entities}
        className='col-start-3 row-span-3 ml-10 w-[250px]'
        selectedEntityInd={selectedEntityInd}
        onEntitySelect={(id) => dispatch({ type: 'select_entity', id })}
        currentTime={currentTime}
        keyframes={keyframes}
      />
    </div>
  )
}

function Entities({
  entities,
  onContextMenu,
  dispatch,
}: {
  entities: Entity[]
  onContextMenu: (entityId: string) => (e: Konva.KonvaEventObject<PointerEvent>) => void
  dispatch: (action: CoreAction) => void
}) {
  console.log(usePrev(entities) === entities)
  console.log(usePrev(onContextMenu) === onContextMenu)
  console.log(usePrev(dispatch) === dispatch)
  console.log('rerendered entities')

  return entities.map((entity) => {
    // check if keyframed
    const propDescriptions = entityTypeToProps[entity.type]

    // const params = selectEntityParams(state, entity.id)
    // const actualParamValues: EntityParams = { ...params }

    // propDescriptions.forEach(({ name, type }) => {
    //   if (!keyframesByEntity[entity.id]?.[name]) {
    //     return
    //   }
    // we have current time, entity and prop name
    // determine seek position for the prop by finding kfs using keyframesByEntity
    // find the tween for this entity, this prop and this current time
    // })

    const params = {}

    const x =
      params?.x ??
      // (getInterpolatedParamValue(entity.id, 'x', sortedKeyframeEntries, currentTime) as
      //   | number
      //   | undefined) ??
      width / 2

    const y =
      params?.y ??
      // (getInterpolatedParamValue(entity.id, 'y', sortedKeyframeEntries, currentTime) as
      //   | number
      //   | undefined) ??
      width / 2

    switch (entity.type) {
      case 'rect':
      case 'melee':
      case 'ranged':
      case 'healer':
      case 'tank':
        return (
          <Rect
            key={entity.id}
            ref={(ref) => {
              externalState.entityRefs[entity.id] = ref
            }}
            x={x}
            y={y}
            width={30}
            height={30}
            fill={entity.initialParams?.fill}
            opacity={entity.initialParams.opacity}
            draggable
            onContextMenu={onContextMenu(entity.id)}
            onClick={(e) => {
              dispatch({ type: 'select_entity', id: entity.id })
              e.cancelBubble = true
            }}
            onMouseDown={(e) => {
              dispatch({ type: 'select_entity', id: entity.id })
              e.cancelBubble = true
            }}
            onDragEnd={(e) => {
              // const newParams = { x: e.target.x(), y: e.target.y() }
              //
              // if (!keyframes.has(currentTime)) {
              //   return
              // }
              // setKeyframes(
              //   (kfs) =>
              //     new Map(
              //       kfs.set(currentTime, {
              //         ...kfs.get(currentTime),
              //         [entity.id]: { ...currentKfParams, ...newParams },
              //       })
              //     )
              // )
            }}
          />
        )
      default:
        alert('Unknown entity type')
    }
  })
}

const MemoedEntities = memo(Entities)
