import { Entity, Keyframes } from '@/components/canvas/canvas-state'

export function EntityList({
  entities,
  selectedEntityInd,
  keyframes,
  currentTime,
  onEntitySelect,
  // onKeyframeAdd,
  // onKeyframeRemove,
  className,
}: {
  entities: Entity[]
  selectedEntityInd?: number
  keyframes: Keyframes
  currentTime: number
  onEntitySelect: (entityId: string) => void
  // onKeyframeAdd: (entityId: string) => void
  // onKeyframeRemove: (entityId: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      <div className='overflow-x-auto rounded-box border border-base-content/5 bg-base-100'>
        <table className='table'>
          <thead>
            <tr>
              <th>Type</th>
              <th>id</th>
              <th>KF</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity, ind) => (
              <tr
                key={entity.id}
                className='cursor-pointer hover:bg-base-300'
                style={{
                  backgroundColor: ind === selectedEntityInd ? 'var(--color-base-300)' : undefined,
                }}
                onClick={() => onEntitySelect(entity.id)}
              >
                <td>{entity.type}</td>
                <td>{entity.id.substring(0, 8)}...</td>
                <td>
                  <label>
                    <input
                      type='checkbox'
                      className='checkbox cursor-default'
                      readOnly
                      checked={entity.id in (keyframes.get(currentTime) ?? {})}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
