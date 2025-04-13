import { useCallback, useEffect, useRef, useState } from 'react'
import Konva from 'konva'
import { CoreAction, Entity, EntityPropName, KfsByEntity } from '@/components/canvas/canvas-state'
import { lerp, lerpRGB, round } from '@/utils'
import Color from 'color'
import { useSearchParams } from 'next/navigation'
import { base64ToState, makeEntity } from '@/components/canvas/canvas-utils'
import { externalState } from '@/components/canvas/external-state'
import { debug } from '@/components/canvas/external-state'

export function useKonvaContextMenu() {
  const [contextMenuState, setContextMenuState] = useState<{
    isShown: boolean
    targetId?: string
    x?: number
    y?: number
  }>({ isShown: false })

  const onContextMenu = useCallback(
    (entityId: string) => (e: Konva.KonvaEventObject<PointerEvent>) => {
      e.evt.preventDefault()

      setContextMenuState({
        isShown: true,
        targetId: entityId,
        x: e.target.getStage()?.getPointerPosition()?.x ?? 0,
        y: e.target.getStage()?.getPointerPosition()?.y ?? 0,
      })
    },
    []
  )

  useEffect(() => {
    const listener = () => setContextMenuState({ isShown: false })
    window.addEventListener('click', listener)

    return () => window.removeEventListener('click', listener)
  }, [])

  return { contextMenuState, onContextMenu }
}

export function useRerender({
  keyframesByEntity,
  currentTime,
  dispatch,
}: {
  keyframesByEntity: KfsByEntity
  currentTime: number
  dispatch: (action: CoreAction) => void
}) {
  useEffect(() => {
    for (const entityId in keyframesByEntity) {
      const kfedProps = keyframesByEntity[entityId]

      for (const prop in kfedProps) {
        const propKfs = kfedProps[prop as EntityPropName]!

        if (propKfs.length === 1) {
          dispatch({
            type: 'set_entity_param',
            id: entityId,
            param: prop as EntityPropName,
            value: propKfs[0].value,
            autoKf: false,
            updateKf: false,
            currentTime,
          })
          continue
        }

        const prevKfInd = propKfs.findLastIndex((kf) => kf.time < currentTime)
        const prevKf = propKfs[prevKfInd]

        // current time is after the last kf, use last kf value
        if (prevKfInd + 1 === propKfs.length) {
          dispatch({
            type: 'set_entity_param',
            id: entityId,
            param: prop as EntityPropName,
            value: prevKf.value,
            autoKf: false,
            updateKf: false,
            currentTime,
          })
          continue
        }

        // current time is before the first kf, use first kf value
        if (prevKfInd < 0) {
          dispatch({
            type: 'set_entity_param',
            id: entityId,
            param: prop as EntityPropName,
            value: propKfs[0].value,
            autoKf: false,
            updateKf: false,
            currentTime,
          })
          continue
        }

        const nextKf = propKfs[prevKfInd + 1]

        // current time is at a kf, use this kf's value
        if (currentTime === nextKf.time) {
          dispatch({
            type: 'set_entity_param',
            id: entityId,
            param: prop as EntityPropName,
            value: nextKf.value,
            autoKf: false,
            updateKf: false,
            currentTime,
          })
          continue
        }

        if (typeof prevKf.value === 'number' && typeof nextKf.value === 'number') {
          debug && console.log('num interp')
          dispatch({
            type: 'set_entity_param',
            id: entityId,
            param: prop as EntityPropName,
            value: round(
              lerp(
                prevKf.value,
                nextKf.value,
                (currentTime - prevKf.time) / (nextKf.time - prevKf.time)
              )
            ),
            autoKf: false,
            updateKf: false,
            currentTime,
          })
          // assume all string props are colors for now
        } else {
          debug && console.log('color interp')
          dispatch({
            type: 'set_entity_param',
            id: entityId,
            param: prop as EntityPropName,
            value: Color.rgb(
              lerpRGB(
                Color(prevKf.value).rgb().array() as [number, number, number],
                Color(nextKf.value).rgb().array() as [number, number, number],
                (currentTime - prevKf.time) / (nextKf.time - prevKf.time)
              )
            ).hex(),
            autoKf: false,
            updateKf: false,
            currentTime,
          })
        }
      }
    }
  }, [currentTime, dispatch, keyframesByEntity])
}

export function useUrlStateRestore(entities: Entity[], dispatch: (action: CoreAction) => void) {
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
  }, [dispatch, entities.length, paramState])
}

export function useSelections(
  entities: Entity[],
  currentTime: number,
  dispatch: (action: CoreAction) => void
) {
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

  const stageOnClick = useCallback(() => {
    debug && console.log('stage onclick')
    setSelectedEntityIds([])
  }, [])

  const stageOnMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
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
  }, [])

  const stageOnMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!selectionRect.isShown) return

      const { x, y } = e.target.getStage()?.getPointerPosition() ?? {}

      if (x === undefined || y === undefined) return

      setSelectionRect((selectionRect) => ({
        ...selectionRect,
        x2: x,
        y2: y,
      }))
    },
    [selectionRect.isShown]
  )

  const stageOnMouseUp = useCallback(() => {
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
        .filter(
          ({ props, selectable }) =>
            selectable &&
            Konva.Util.haveIntersection(selection, {
              x: props.x,
              y: props.y,
              width: props.width ?? props.radius! * 2,
              height: props.height ?? props.radius! * 2,
            })
        )
        .map((e) => e.id)
    )
  }, [
    entities,
    selectionRect.isShown,
    selectionRect.x1,
    selectionRect.x2,
    selectionRect.y1,
    selectionRect.y2,
  ])

  const onTransformEnd = () => {
    transformerRef.current!.nodes().forEach((node) => {
      if (node.getClassName() === 'Rect' || node.getClassName() === 'Image') {
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
        node.scaleX(1)
        node.scaleY(1)
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
        node.scaleX(1)
        node.scaleY(1)
      }

      if (node.getClassName() === 'Ring') {
        dispatch({
          type: 'set_entity_param',
          id: node.id(),
          param: 'innerRadius',
          value: round((node as Konva.Ring).innerRadius() * node.scaleX()),
          autoKf: true,
          updateKf: true,
          currentTime,
        })
        dispatch({
          type: 'set_entity_param',
          id: node.id(),
          param: 'outerRadius',
          value: round((node as Konva.Ring).outerRadius() * node.scaleX()),
          autoKf: true,
          updateKf: true,
          currentTime,
        })
        node.scaleX(1)
        node.scaleY(1)
      }

      if (node.getClassName() === 'Path' || node.getClassName() === 'Text') {
        dispatch({
          type: 'set_entity_param',
          id: node.id(),
          param: 'scaleX',
          value: round(node.scaleX()),
          autoKf: true,
          updateKf: true,
          currentTime,
        })
        dispatch({
          type: 'set_entity_param',
          id: node.id(),
          param: 'scaleY',
          value: round(node.scaleY()),
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

      node.rotate(0)
    })
  }

  return {
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
  }
}

export function useHotkeys({
  selectedEntityIds,
  setSelectedEntityIds,
  dispatch,
  togglePlaying,
}: {
  selectedEntityIds: string[]
  setSelectedEntityIds: (ids: string[]) => void
  dispatch: (action: CoreAction) => void
  togglePlaying: () => void
}) {
  useEffect(() => {
    const keyEventHandler = (e: KeyboardEvent) => {
      if (externalState.isInputting) return

      e.preventDefault()

      switch (e.key) {
        case 'm': {
          const entity = makeEntity('melee')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
          break
        }
        case 'r': {
          const entity = makeEntity('ranged')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
          break
        }
        case 'h': {
          const entity = makeEntity('healer')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
          break
        }
        case 't': {
          const entity = makeEntity('tank')
          dispatch({ type: 'add_entity', entity })
          setSelectedEntityIds([entity.id])
          break
        }
        case 'Backspace': {
          selectedEntityIds.forEach((entityId) => {
            dispatch({ type: 'delete_entity', id: entityId })
          })
          setSelectedEntityIds([])
          break
        }
        case ' ': {
          togglePlaying()
          break
        }
      }
    }

    window.addEventListener('keydown', keyEventHandler, true)

    return () => window.removeEventListener('keydown', keyEventHandler, true)
  }, [dispatch, selectedEntityIds, togglePlaying, setSelectedEntityIds])
}

export function usePlay() {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(3)
  const [fps, setFps] = useState(10)

  const [isPlaying, setIsPlaying] = useState(false)
  const playerInterval = useRef<number | null>(null)

  const play = useCallback(() => {
    const frameDuration = 1 / fps

    setIsPlaying(true)
    playerInterval.current = window.setInterval(() => {
      setCurrentTime(
        (time) => Math.round((time >= duration ? 0 : time + frameDuration) * 1000) / 1000
      )
    }, frameDuration * 1000)
  }, [duration, fps])

  const pause = useCallback(() => {
    setIsPlaying(false)

    if (playerInterval.current) {
      window.clearInterval(playerInterval.current)
    }
  }, [])

  const togglePlaying = useCallback(() => (isPlaying ? pause() : play()), [isPlaying, pause, play])

  return {
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    fps,
    setFps,
    isPlaying,
    togglePlaying,
  }
}
