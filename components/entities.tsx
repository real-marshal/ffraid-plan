/* eslint-disable jsx-a11y/alt-text */
import { Circle, Rect, Image, Path, Ring, Text, Group } from 'react-konva'
import { CoreAction, Entity, EntityProps } from '@/components/canvas/canvas-state'
import Konva from 'konva'
import { externalState, svgEntityDimensions } from '@/components/canvas/external-state'
import { round } from '@/utils'
import useImage from 'use-image'

export function Entities({
  entities,
  dispatch,
  currentTime,
  onContextMenu,
  setSelectedEntityIds,
  selectedEntityIds,
  addRemoveEntityId,
}: {
  entities: Entity[]
  dispatch: (action: CoreAction) => void
  currentTime: number
  onContextMenu: (e: Konva.KonvaEventObject<PointerEvent>) => void
  setSelectedEntityIds: (ids: string[]) => void
  selectedEntityIds: string[]
  addRemoveEntityId: (id: string) => void
}) {
  return entities.map((entity) => {
    const commonProps = {
      id: entity.id,
      ref: (ref: Konva.Node | null) => {
        externalState.entityRefs[entity.id] = ref
      },
      draggable: entity.selectable,
      onContextMenu,
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!entity.selectable) return

        e.evt.ctrlKey ? addRemoveEntityId(entity.id) : setSelectedEntityIds([entity.id])
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
      case 'triangle':
      case 'arrow':
        return (
          <Path
            key={entity.id}
            {...entity.props}
            {...commonProps}
            offsetX={(svgEntityDimensions[entity.type]?.width ?? 0) / 2}
            offsetY={(svgEntityDimensions[entity.type]?.height ?? 0) / 2}
          />
        )
      case 'ring': {
        return (
          <Ring key={entity.id} {...(entity.props as Required<EntityProps>)} {...commonProps} />
        )
      }
      case 'text': {
        return <Text key={entity.id} {...entity.props} {...commonProps} li />
      }
      case 'checkerboard': {
        const { gridSize, cellSize, cellColor1, cellColor2, ...entityProps } = entity.props

        return (
          <Group
            key={entity.id}
            {...entityProps}
            {...commonProps}
            offsetX={(gridSize! * cellSize!) / 2}
            offsetY={(gridSize! * cellSize!) / 2}
          >
            {Array(gridSize)
              .fill(0)
              .map((_, xInd) => {
                return Array(gridSize)
                  .fill(0)
                  .map((_, yInd) => {
                    return (
                      <Rect
                        key={xInd + yInd}
                        x={xInd * cellSize!}
                        y={yInd * cellSize!}
                        width={cellSize}
                        height={cellSize}
                        fill={
                          (xInd % 2 === 0 && yInd % 2 === 1) || (xInd % 2 === 1 && yInd % 2 === 0)
                            ? cellColor2
                            : cellColor1
                        }
                      />
                    )
                  })
              })}
          </Group>
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
