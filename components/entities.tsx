/* eslint-disable jsx-a11y/alt-text */
import { Circle, Rect, Arrow, Image, Path, Ring } from 'react-konva'
import { CoreAction, Entity, EntityProps } from '@/components/canvas/canvas-state'
import Konva from 'konva'
import { externalState } from '@/components/canvas/external-state'
import { round } from '@/utils'
import useImage from 'use-image'

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
      draggable: entity.selectable,
      onContextMenu: onContextMenu(entity.id),
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!entity.selectable) return

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
      case 'melee':
      case 'ranged':
      case 'healer':
      case 'tank':
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image: _, ...entityProps } = entity.props
        return <RoleEntity key={entity.id} entity={entity} {...entityProps} {...commonProps} />
      case 'rect':
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
      case 'triangle':
        return <Path key={entity.id} {...entity.props} {...commonProps} offsetX={40} offsetY={65} />
      case 'ring': {
        return (
          <Ring key={entity.id} {...(entity.props as Required<EntityProps>)} {...commonProps} />
        )
      }
      default:
        alert('Unknown entity type')
    }
  })
}

function RoleEntity({ entity, ...imageProps }: { entity: Entity } & Partial<Konva.ImageConfig>) {
  const [image] = useImage(entity.props.image ?? '')

  return (
    <Image
      {...entity.props}
      {...imageProps}
      image={image}
      offsetX={entity.props.width! / 2}
      offsetY={entity.props.height! / 2}
    />
  )
}
