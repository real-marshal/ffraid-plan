import { Entity, KfsByEntity } from '@/components/canvas/canvas-state'
import { isObjEmpty } from '@/utils'
import { DragHandle } from '@/components/svg'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useId } from 'react'

export function EntityList({
  entities,
  selectedEntityIds,
  keyframesByEntity,
  onEntitySelect,
  onEntitySelectableToggle,
  onEntityMove,
  className,
}: {
  entities: Entity[]
  selectedEntityIds: string[]
  keyframesByEntity: KfsByEntity
  onEntitySelect: (entityId: string) => void
  onEntitySelectableToggle: (entityId: string) => void
  onEntityMove: (ind: number, newInd: number) => void
  className?: string
}) {
  const id = useId()

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={(e) => {
        const { active, over } = e

        if (over && active.id !== over.id) {
          const ind = entities.findIndex((e) => e.id === active.id)
          const newInd = entities.findIndex((e) => e.id === over.id)

          onEntityMove(ind, newInd)
        }
      }}
      id={id}
    >
      <SortableContext items={entities} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {entities.length > 0 && (
            <div className='overflow-x-auto rounded-box border border-base-content/5 bg-base-100'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>type</th>
                    <th>id</th>
                    <th>SL</th>
                    <th>KF</th>
                    <th>Z</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity) => (
                    <EntityListEntry
                      key={entity.id}
                      entity={entity}
                      selectedEntityIds={selectedEntityIds}
                      onEntitySelect={onEntitySelect}
                      onEntitySelectableToggle={onEntitySelectableToggle}
                      isKfed={!isObjEmpty(keyframesByEntity[entity.id])}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function EntityListEntry({
  entity,
  selectedEntityIds,
  onEntitySelect,
  onEntitySelectableToggle,
  isKfed,
}: {
  entity: Entity
  selectedEntityIds: string[]
  onEntitySelect: (entityId: string) => void
  onEntitySelectableToggle: (entityId: string) => void
  isKfed: boolean
}) {
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entity.id,
  })

  return (
    <tr
      key={entity.id}
      className='cursor-pointer hover:bg-base-300'
      style={{
        backgroundColor: selectedEntityIds.includes(entity.id)
          ? 'var(--color-base-300)'
          : undefined,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={() => onEntitySelect(entity.id)}
      ref={setNodeRef}
    >
      <td>{entity.type}</td>
      <td>{entity.id}</td>
      <td>
        <label>
          <input
            type='checkbox'
            className='checkbox cursor-default'
            checked={entity.selectable}
            onChange={() => onEntitySelectableToggle(entity.id)}
          />
        </label>
      </td>
      <td>
        <label>
          <input type='checkbox' className='checkbox cursor-default' readOnly checked={isKfed} />
        </label>
      </td>
      <td {...listeners} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
        <DragHandle className='size-4 fill-current' />
      </td>
    </tr>
  )
}
