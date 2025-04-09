import { Entity, EntityParamName, EntityParams, Keyframes } from '@/components/canvas/canvas-state'
import Color from 'color'

export const entityTypeToProps: Record<
  Entity['type'],
  { name: EntityParamName; type: 'color' | 'number' }[]
> = {
  melee: [],
  ranged: [],
  healer: [],
  tank: [],
  rect: [
    { name: 'fill', type: 'color' },
    { name: 'opacity', type: 'number' },
    { name: 'x', type: 'number' },
    { name: 'y', type: 'number' },
  ],
  circle: [
    { name: 'fill', type: 'color' },
    { name: 'opacity', type: 'number' },
    { name: 'x', type: 'number' },
    { name: 'y', type: 'number' },
  ],
}

export function EntityProps({
  entity,
  values,
  className,
  onPropChange,
  keyframes,
  currentTime,
  onKf,
}: {
  entity?: Entity
  values?: EntityParams
  onPropChange: (propName: EntityParamName, value: number | string) => void
  onKf: (propName: EntityParamName) => void
  keyframes: Keyframes
  currentTime: number
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 mr-10 ${className}`}>
      {entity &&
        values &&
        entityTypeToProps[entity.type].map(({ name, type }) => (
          <label
            key={name}
            className='input cursor-pointer flex flex-row justify-between items-center w-[200px]'
          >
            <span className='label'>{name}</span>
            {getInput(type, name, onPropChange, values)}
            <button
              className='btn btn-xs p-1 m-0'
              onClick={() => onKf(name)}
              style={{
                backgroundColor:
                  name in (keyframes.get(currentTime)?.[entity.id] ?? {})
                    ? 'var(--color-red-900)'
                    : undefined,
              }}
            >
              KF
            </button>
          </label>
        ))}
    </div>
  )
}

function getInput(
  type: 'color' | 'number',
  propName: EntityParamName,
  onPropChange: (propName: EntityParamName, value: number | string) => void,
  values: EntityParams
) {
  switch (type) {
    case 'color':
      return (
        <input
          type='color'
          className='w-[40px] h-[40px] cursor-pointer p-2 '
          value={values[propName]}
          onChange={(e) => onPropChange(propName, e.target.value)}
        />
      )
    case 'number':
      return (
        <input
          type='number'
          value={values[propName]}
          onChange={(e) => onPropChange(propName, Number.parseFloat(e.target.value))}
          step={0.1}
        />
      )
    default:
      return <span>${type} is not implemented</span>
  }
}
