'use client'

// shouldn't be applied to canvas images
/* eslint-disable jsx-a11y/alt-text */

import { Layer, Stage, Image, Rect, Transformer } from 'react-konva'
import { useEffect, useReducer, useRef, useState } from 'react'
import { ArenaPicker } from '@/components/arena-picker'
import { Menu } from '@/components/menu'
import { VerticalMenu } from '@/components/vertical-menu'
import { ContextMenu } from '@/components/context-menu'
import { EntityList } from '@/components/entity-list'
import { EntityPropEditor } from '@/components/entity-prop-editor'
import { useKonvaContextMenu, useRerender } from './canvas-hooks'
import { base64ToState, kfsToWaapi, makeEntity, stateToBase64 } from './canvas-utils'
import { coreReducer, initialState } from './canvas-state'
import { Entities } from '@/components/entities'
import Konva from 'konva'
import { externalState } from '@/components/canvas/external-state'
import { KfTimeline } from '@/components/kf-timeline'
import { Timeline } from '@/components/timeline'
import { round } from '@/utils'
import { useSearchParams } from 'next/navigation'

export const width = 600
export const height = 600

export function Canvas() {
  const [arena, setArena] = useState<ImageBitmap>()
  const arenaImageRef = useRef<Konva.Image>(null)

  const { contextMenuState, onContextMenu } = useKonvaContextMenu()

  const [state, dispatch] = useReducer(coreReducer, initialState)
  const { entities, keyframes, keyframesByEntity } = state

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(3)

  const [isPlaying, setIsPlaying] = useState(false)
  const playerInterval = useRef<number | null>(null)

  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([])
  const selectedEntity = selectedEntityIds[0]
    ? entities.find((e) => e.id === selectedEntityIds[0])
    : undefined
  const selectedEntities = entities.filter((e) => selectedEntityIds.includes(e.id))

  const [selectionRect, setSelectionRect] = useState({
    isShown: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  })

  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (!transformerRef.current) return

    if (!selectedEntityIds.length) {
      transformerRef.current.nodes([])
      return
    }

    const nodes = selectedEntityIds.map((id) => externalState.entityRefs[id]).filter((ref) => !!ref)

    transformerRef.current.nodes(nodes)
  }, [selectedEntityIds])

  useRerender({ keyframesByEntity, currentTime, dispatch })

  console.log('canvas rerender')

  const params = useSearchParams()
  const paramState = params.get('s')

  useEffect(() => {
    if (!paramState || entities.length > 0) return
    ;(async () => {
      try {
        const restoredState = await base64ToState(paramState)
        console.log(restoredState)
        setTimeout(() => {
          dispatch({ type: 'replace_state', newState: restoredState })
        }, 10)
      } catch (err) {
        alert(err)
        console.error(err)
      }
    })()
  }, [entities.length, paramState])

  // http://localhost:3000?s=G48ACI7URjVTnI5Q6UbM7dMU0SimaZYRu66PWVuid4iksAYg0ADsBgcSBZQEBFE-4SA68WXJ1ELzrTSUBpvZzofl3Hy0MP6zIvC1MgBUwDE64BimmCJJUikr8bJc-bDk0h9a4xjCwwgEld5v2gE7AkAc9N2uHEUKemZ0HQ
  return (
    <div className='grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr_auto_auto]'>
      {selectedEntityIds.length > 0 && (
        <EntityPropEditor
          className='col-start-1 row-start-1 row-span-3'
          entities={selectedEntities}
          onPropChange={(propName, value) => {
            console.log('onPropChange')

            selectedEntities.forEach((e) =>
              dispatch({
                type: 'set_entity_param',
                id: e.id,
                param: propName,
                value,
                autoKf: true,
                updateKf: true,
                currentTime,
              })
            )
          }}
          onKf={(param) =>
            keyframesByEntity[selectedEntity!.id]?.[param]?.find((kf) => kf.time === currentTime)
              ? selectedEntities.forEach((e) =>
                  dispatch({ type: 'remove_kf', entityId: e.id, param, currentTime })
                )
              : selectedEntities.forEach((e) =>
                  dispatch({ type: 'set_kf', entityId: e.id, param, currentTime })
                )
          }
          currentTime={currentTime}
          keyframes={keyframes}
        />
      )}
      <Menu
        className='col-start-2'
        onClear={() => {
          dispatch({ type: 'reset' })
          window.history.replaceState({}, '', '/')
        }}
        onWaapiExport={() => {
          const waapiObj = kfsToWaapi(entities, keyframes, duration)

          void navigator.clipboard.writeText(JSON.stringify(waapiObj))
        }}
        onLinkExport={async () => {
          if (!entities.length) return

          try {
            const base64 = await stateToBase64(entities, keyframes, duration)

            window.history.replaceState({}, '', `?s=${base64}`)
          } catch (err) {
            alert(err)
            console.error(err)
          }
        }}
      />
      <VerticalMenu
        className='col-start-1 row-start-2 self-end justify-self-end'
        onMeleeAdd={() => {
          const entity = makeEntity('melee')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
        }}
        onRangedAdd={() => {
          const entity = makeEntity('ranged')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
        }}
        onHealerAdd={() => {
          const entity = makeEntity('healer')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
        }}
        onTankAdd={() => {
          const entity = makeEntity('tank')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
        }}
        onRectAdd={() => {
          const entity = makeEntity('rect')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
        }}
        onCircAdd={() => {
          const entity = makeEntity('circle')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
        }}
      />
      <div
        className={`col-start-2 row-start-2 justify-center relative w-[${width}px] h-[${height}px]`}
        data-theme='dark'
      >
        <Stage
          width={width}
          height={height}
          className='bg-gray-600'
          onClick={() => {
            console.log('stage onclick')
            setSelectedEntityIds([])
          }}
          onMouseDown={(e) => {
            if (e.target.id() !== 'arena-image') {
              return
            }

            const { x, y } = e.target.getStage()?.getPointerPosition() ?? {}
            if (x === undefined || y === undefined) return

            setSelectionRect({
              isShown: true,
              x1: x,
              y1: y,
              x2: x,
              y2: y,
            })
          }}
          onMouseMove={(e) => {
            if (!selectionRect.isShown) return

            const { x, y } = e.target.getStage()?.getPointerPosition() ?? {}
            console.log(`x ${x} y ${y}`)
            if (x === undefined || y === undefined) return

            setSelectionRect((selectionRect) => ({
              ...selectionRect,
              x2: x,
              y2: y,
            }))
          }}
          onMouseUp={() => {
            if (!selectionRect.isShown) return

            setSelectionRect((selectionRect) => ({
              ...selectionRect,
              isShown: false,
            }))

            const selection = {
              x: Math.min(selectionRect.x1, selectionRect.x2),
              y: Math.min(selectionRect.y1, selectionRect.y2),
              width: Math.abs(selectionRect.x2 - selectionRect.x1),
              height: Math.abs(selectionRect.y2 - selectionRect.y1),
            }

            setSelectedEntityIds(
              entities
                .filter(({ props }) =>
                  Konva.Util.haveIntersection(selection, {
                    x: props.x,
                    y: props.y,
                    width: props.width ?? props.radius! * 2,
                    height: props.height ?? props.radius! * 2,
                  })
                )
                .map((e) => e.id)
            )
          }}
        >
          <Layer>
            <Image
              id='arena-image'
              image={arena}
              width={width}
              height={height}
              ref={arenaImageRef}
            />
          </Layer>
          <Layer>
            <Entities
              entities={entities}
              currentTime={currentTime}
              dispatch={dispatch}
              onContextMenu={onContextMenu}
              selectedEntityIds={selectedEntityIds}
              setSelectedEntityIds={setSelectedEntityIds}
            />
          </Layer>
          <Layer>
            {selectionRect.isShown && (
              <Rect
                x={Math.min(selectionRect.x1, selectionRect.x2)}
                y={Math.min(selectionRect.y1, selectionRect.y2)}
                width={Math.abs(selectionRect.x2 - selectionRect.x1)}
                height={Math.abs(selectionRect.y2 - selectionRect.y1)}
                fill='#54a9f28a'
                stroke='#54a9f2'
              />
            )}
            <Transformer
              rotateLineVisible={false}
              anchorSize={6}
              anchorStrokeWidth={1}
              rotateAnchorOffset={20}
              rotationSnaps={Array(32)
                .fill(0)
                .map((_, ind) => (ind * 360) / 32)}
              ref={transformerRef}
              onTransformEnd={() => {
                transformerRef.current!.nodes().forEach((node) => {
                  if (node.getClassName() === 'Rect') {
                    dispatch({
                      type: 'set_entity_param',
                      id: node.id(),
                      param: 'width',
                      value: round(node.width() * node.scaleX()),
                      autoKf: true,
                      updateKf: true,
                      currentTime,
                    })
                    dispatch({
                      type: 'set_entity_param',
                      id: node.id(),
                      param: 'height',
                      value: round(node.height() * node.scaleY()),
                      autoKf: true,
                      updateKf: true,
                      currentTime,
                    })
                  }

                  if (node.getClassName() === 'Circle') {
                    dispatch({
                      type: 'set_entity_param',
                      id: node.id(),
                      param: 'radius',
                      value: round((node as Konva.Circle).radius() * node.scaleX()),
                      autoKf: true,
                      updateKf: true,
                      currentTime,
                    })
                  }

                  dispatch({
                    type: 'set_entity_param',
                    id: node.id(),
                    param: 'rotation',
                    value: round(node.rotation()),
                    autoKf: true,
                    updateKf: true,
                    currentTime,
                  })
                  node.scaleX(1)
                  node.scaleY(1)
                  node.rotate(0)
                })
              }}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox
                }
                return newBox
              }}
            />
          </Layer>
        </Stage>
        {!arena && <ArenaPicker onPick={(arena) => setArena(arena)} />}
        {contextMenuState.isShown && (
          <ContextMenu
            style={{
              left: contextMenuState.x,
              top: contextMenuState.y,
            }}
            onDelete={() => {
              dispatch({ type: 'delete_entity', id: contextMenuState.targetId! })
              setSelectedEntityIds([])
            }}
          />
        )}
      </div>
      <Timeline
        isPlaying={isPlaying}
        onPlay={(duration) => {
          setIsPlaying(true)
          playerInterval.current = window.setInterval(() => {
            setCurrentTime((time) => Math.round((time >= duration ? 0 : time + 0.1) * 10) / 10)
          }, 100)
        }}
        onPause={() => {
          setIsPlaying(false)

          if (playerInterval.current) {
            window.clearInterval(playerInterval.current)
          }
        }}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={duration}
        setDuration={setDuration}
      />
      <KfTimeline
        keyframesByEntity={keyframesByEntity}
        duration={duration}
        onKfMove={(time, newTime) => dispatch({ type: 'move_kf', time, newTime })}
      />
      <EntityList
        entities={entities}
        className='col-start-3 row-span-3 ml-10 w-[250px]'
        selectedEntityIds={selectedEntityIds}
        onEntitySelect={(id) => setSelectedEntityIds([id])}
        keyframesByEntity={keyframesByEntity}
      />
    </div>
  )
}
