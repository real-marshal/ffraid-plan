import { useCallback, useEffect, useState } from 'react'
import Konva from 'konva'

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
