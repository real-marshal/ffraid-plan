import { Circle, Rect, Arrow } from 'react-konva'
import { CoreAction, Entity } from '@/components/canvas/canvas-state'
import Konva from 'konva'
import { externalState } from '@/components/canvas/external-state'
import { round } from '@/utils'

export function Entities({
  entities,
  dispatch,
  currentTime,
  onContextMenu,
  setSelectedEntityIds,
  selectedEntityIds,
}: {
  entities: Entity[]
  dispatch: (action: CoreAction) => void
  currentTime: number
  onContextMenu: (entityId: string) => (e: Konva.KonvaEventObject<PointerEvent>) => void
  setSelectedEntityIds: (ids: string[]) => void
  selectedEntityIds: string[]
}) {
  return entities.map((entity) => {
    const commonProps = {
      id: entity.id,
      ref: (ref: Konva.Node | null) => {
        externalState.entityRefs[entity.id] = ref
      },
      draggable: true,
      onContextMenu: onContextMenu(entity.id),
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        setSelectedEntityIds([entity.id])
        e.cancelBubble = true
      },
      onDragStart: (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.target.getStage()!.container().style.cursor = 'grabbing'

        if (selectedEntityIds.includes(entity.id)) return
        setSelectedEntityIds([entity.id])
      },
      onMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.target.getStage()!.container().style.cursor = 'pointer'
      },
      onMouseOver: (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.target.getStage()!.container().style.cursor = 'pointer'
      },
      onMouseOut: (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.target.getStage()!.container().style.cursor = 'default'
      },
      onDragEnd: (e: Konva.KonvaEventObject<MouseEvent>) => {
        dispatch({
          type: 'set_entity_param',
          id: entity.id,
          param: 'x',
          value: round(e.target.x()),
          autoKf: true,
          updateKf: true,
          currentTime,
        })
        dispatch({
          type: 'set_entity_param',
          id: entity.id,
          param: 'y',
          value: round(e.target.y()),
          autoKf: true,
          updateKf: true,
          currentTime,
        })
      },
    }

    switch (entity.type) {
      case 'rect':
      case 'melee':
      case 'ranged':
      case 'healer':
      case 'tank':
        return (
          <Rect
            key={entity.id}
            {...entity.props}
            {...commonProps}
            offsetX={entity.props.width! / 2}
            offsetY={entity.props.height! / 2}
          />
        )
      case 'circle':
        return <Circle key={entity.id} {...entity.props} {...commonProps} />
      case 'arrow':
        // waapi export depends on these dimensions
        const length = 100
        return (
          <Arrow
            key={entity.id}
            {...entity.props}
            {...commonProps}
            offsetX={length / 2}
            points={[0, 0, length, 0]}
            pointerLength={20}
            pointerWidth={20}
            strokeWidth={10}
          />
        )
      default:
        alert('Unknown entity type')
    }
  })
}
