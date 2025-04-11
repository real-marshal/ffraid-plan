import { useCallback, useEffect, useState } from 'react'
import Konva from 'konva'
import { CoreAction, EntityPropName, KfsByEntity } from '@/components/canvas/canvas-state'
import { lerp, lerpRGB, round } from '@/utils'
import Color from 'color'

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

        const prevKfInd = propKfs.findLastIndex((kf) => kf.time <= currentTime)

        // no need to interpolate anything if it's the last kf
        if (prevKfInd < 0 || prevKfInd + 1 >= propKfs.length) continue

        const prevKf = propKfs[prevKfInd]
        const nextKf = propKfs[prevKfInd + 1]

        if (typeof prevKf.value === 'number' && typeof nextKf.value === 'number') {
          console.log('num interp')
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
          console.log('color interp')
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
