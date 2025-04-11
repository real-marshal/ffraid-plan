import { Entity, KfsByEntity } from '@/components/canvas/canvas-state'
import { isObjEmpty } from '@/utils'

export function EntityList({
  entities,
  selectedEntityIds,
  keyframesByEntity,
  onEntitySelect,
  className,
}: {
  entities: Entity[]
  selectedEntityIds: string[]
  keyframesByEntity: KfsByEntity
  onEntitySelect: (entityId: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      {entities.length > 0 && (
        <div className='overflow-x-auto rounded-box border border-base-content/5 bg-base-100'>
          <table className='table'>
            <thead>
              <tr>
                <th>type</th>
                <th>id</th>
                <th>KF</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr
                  key={entity.id}
                  className='cursor-pointer hover:bg-base-300'
                  style={{
                    backgroundColor: selectedEntityIds.includes(entity.id)
                      ? 'var(--color-base-300)'
                      : undefined,
                  }}
                  onClick={() => onEntitySelect(entity.id)}
                >
                  <td>{entity.type}</td>
                  <td>{entity.id}</td>
                  <td>
                    <label>
                      <input
                        type='checkbox'
                        className='checkbox cursor-default'
                        readOnly
                        checked={!isObjEmpty(keyframesByEntity[entity.id])}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
