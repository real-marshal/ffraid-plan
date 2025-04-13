'use client'

// shouldn't be applied to canvas images
/* eslint-disable jsx-a11y/alt-text */

import { Layer, Stage, Image, Rect, Transformer } from 'react-konva'
import { useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { ArenaPicker } from '@/components/arena-picker'
import { Menu } from '@/components/menu'
import { VerticalMenu } from '@/components/vertical-menu'
import { ContextMenu } from '@/components/context-menu'
import { EntityList } from '@/components/entity-list'
import { EntityPropEditor } from '@/components/entity-prop-editor'
import {
  useHotkeys,
  useKonvaContextMenu,
  usePlay,
  useRerender,
  useSelections,
  useUrlStateRestore,
} from './canvas-hooks'
import { kfsToWaapi, makeEntity, stateToBase64 } from './canvas-utils'
import { coreReducer, EntityPropName, EntityType, initialState } from './canvas-state'
import { Entities } from '@/components/entities'
import Konva from 'konva'
import { KfTimeline } from '@/components/kf-timeline'
import { Timeline } from '@/components/timeline'
import { Box } from 'konva/lib/shapes/Transformer'
import { debug, height, width } from '@/components/canvas/external-state'
import { debounce } from '@/utils'

export function Canvas() {
  const [arena, setArena] = useState<ImageBitmap>()
  const arenaImageRef = useRef<Konva.Image>(null)

  const { contextMenuState, onContextMenu } = useKonvaContextMenu()

  const [state, dispatch] = useReducer(coreReducer, initialState)
  const { entities, keyframes, keyframesByEntity } = state

  const {
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    fps,
    setFps,
    isPlaying,
    togglePlaying,
  } = usePlay()

  const {
    selectedEntityIds,
    setSelectedEntityIds,
    selectedEntity,
    selectedEntities,
    selectionRect,
    transformerRef,
    stageOnClick,
    stageOnMouseDown,
    stageOnMouseMove,
    stageOnMouseUp,
    onTransformEnd,
  } = useSelections(entities, currentTime, dispatch)

  useRerender({ keyframesByEntity, currentTime, dispatch })

  useUrlStateRestore(entities, dispatch)

  useHotkeys({ selectedEntityIds, setSelectedEntityIds, dispatch, togglePlaying })

  const onPropChange = debounce(
    useCallback(
      (propName: EntityPropName, value: number | string) => {
        debug && console.log('onPropChange')

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
      },
      [currentTime, selectedEntities]
    ),
    50
  )

  debug && console.log('canvas rerender')
  debug && console.log('new state')
  debug && console.log(state)

  return (
    <div className='grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr_auto_auto]'>
      {selectedEntityIds.length > 0 && (
        <EntityPropEditor
          className='col-start-1 row-start-1 row-span-3'
          entities={selectedEntities}
          onPropChange={onPropChange}
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
          setSelectedEntityIds([])
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
        className='col-start-1 row-start-2 self-end justify-self-end mr-1'
        onEntityAdd={(type: EntityType) => {
          const entity = makeEntity(type)
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
          onClick={stageOnClick}
          onMouseDown={stageOnMouseDown}
          onMouseMove={stageOnMouseMove}
          onMouseUp={stageOnMouseUp}
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
              id='transformer'
              // allows dragging from empty space in a transformer box
              shouldOverdrawWholeArea
              centeredScaling
              rotateLineVisible={false}
              anchorSize={6}
              anchorStrokeWidth={1}
              rotateAnchorOffset={20}
              rotationSnaps={useMemo(
                () =>
                  Array(32)
                    .fill(0)
                    .map((_, ind) => (ind * 360) / 32),
                []
              )}
              ref={transformerRef}
              onTransformEnd={onTransformEnd}
              boundBoxFunc={useCallback((oldBox: Box, newBox: Box) => {
                // min resize
                return newBox.width < 10 || newBox.height < 10 ? oldBox : newBox
              }, [])}
              onDragStart={(e) => {
                e.target.getStage()!.container().style.cursor = 'grabbing'
              }}
              onMouseOver={(e) => {
                e.target.getStage()!.container().style.cursor = 'pointer'
              }}
              onMouseUp={(e) => {
                e.target.getStage()!.container().style.cursor = 'default'
              }}
              onMouseOut={(e) => {
                e.target.getStage()!.container().style.cursor = 'default'
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
        onPlay={togglePlaying}
        onPause={togglePlaying}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={duration}
        setDuration={setDuration}
        fps={fps}
        setFps={setFps}
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
        onEntitySelectableToggle={(entityId) =>
          dispatch({ type: 'toggle_selectable', id: entityId })
        }
      />
    </div>
  )
}
