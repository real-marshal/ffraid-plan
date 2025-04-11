import { Circle, Rect } from 'react-konva'
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
    switch (entity.type) {
      case 'rect':
      case 'melee':
      case 'ranged':
      case 'healer':
      case 'tank':
        return (
          <Rect
            {...entity.props}
            offsetX={entity.props.width! / 2}
            offsetY={entity.props.height! / 2}
            key={entity.id}
            id={entity.id}
            ref={(ref) => {
              externalState.entityRefs[entity.id] = ref
            }}
            draggable
            onContextMenu={onContextMenu(entity.id)}
            onClick={(e) => {
              setSelectedEntityIds([entity.id])
              e.cancelBubble = true
            }}
            onDragStart={(e) => {
              e.target.getStage()!.container().style.cursor = 'grabbing'

              if (selectedEntityIds.includes(entity.id)) return
              setSelectedEntityIds([entity.id])
            }}
            onMouseUp={(e) => {
              e.target.getStage()!.container().style.cursor = 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.getStage()!.container().style.cursor = 'pointer'
            }}
            onMouseOut={(e) => {
              e.target.getStage()!.container().style.cursor = 'default'
            }}
            onDragEnd={(e) => {
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
            }}
          />
        )
      case 'circle':
        return (
          <Circle
            {...entity.props}
            key={entity.id}
            id={entity.id}
            ref={(ref) => {
              externalState.entityRefs[entity.id] = ref
            }}
            draggable
            onContextMenu={onContextMenu(entity.id)}
            onClick={(e) => {
              setSelectedEntityIds([entity.id])
              e.cancelBubble = true
            }}
            onDragStart={(e) => {
              e.target.getStage()!.container().style.cursor = 'grabbing'

              if (selectedEntityIds.includes(entity.id)) return
              setSelectedEntityIds([entity.id])
            }}
            onMouseUp={(e) => {
              e.target.getStage()!.container().style.cursor = 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.getStage()!.container().style.cursor = 'pointer'
            }}
            onMouseOut={(e) => {
              e.target.getStage()!.container().style.cursor = 'default'
            }}
            onDragEnd={(e) => {
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
            }}
          />
        )
      default:
        alert('Unknown entity type')
    }
  })
}
