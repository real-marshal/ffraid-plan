import { Entity, EntityPropName, Kf } from '@/components/canvas/canvas-state'
import { NumberInput } from '@/components/number-input'

export type PropType = 'color' | 'number'

export interface PropDescription {
  name: EntityPropName
  type: PropType
}

const baseProps: PropDescription[] = [
  { name: 'opacity', type: 'number' },
  { name: 'x', type: 'number' },
  { name: 'y', type: 'number' },
  { name: 'rotation', type: 'number' },
]

const roleProps: PropDescription[] = [
  ...baseProps,
  { name: 'width', type: 'number' },
  { name: 'height', type: 'number' },
  { name: 'fill', type: 'color' },
]

export const entityTypeToProps: Record<Entity['type'], PropDescription[]> = {
  melee: roleProps,
  ranged: roleProps,
  healer: roleProps,
  tank: roleProps,
  rect: [
    ...baseProps,
    { name: 'width', type: 'number' },
    { name: 'height', type: 'number' },
    { name: 'fill', type: 'color' },
  ],
  circle: [...baseProps, { name: 'radius', type: 'number' }, { name: 'fill', type: 'color' }],
  arrow: [
    ...baseProps,
    { name: 'stroke', type: 'color' },
    { name: 'scaleX', type: 'number' },
    { name: 'scaleY', type: 'number' },
  ],
}

export function EntityPropEditor({
  entities,
  className,
  onPropChange,
  keyframes,
  currentTime,
  onKf,
}: {
  entities: Entity[]
  onPropChange: (propName: EntityPropName, value: number | string) => void
  onKf: (propName: EntityPropName) => void
  keyframes: Kf[]
  currentTime: number
  className?: string
}) {
  const props: PropDescription[] =
    entities.length === 1 ? entityTypeToProps[entities[0].type] : getEntitiesProps(entities)

  return (
    <div className={`flex flex-col gap-2 mr-10 ${className}`}>
      {entities.length > 0 &&
        props.map(({ name, type }) => {
          const oneValue = entities[0].props[name]
          const value =
            entities.length === 1
              ? oneValue
              : entities.every((e) => e.props[name] === oneValue)
                ? oneValue
                : undefined
          const isKfed =
            entities.length === 1
              ? keyframes.find(
                  (kf) =>
                    kf.time === currentTime && kf.entityId === entities[0].id && kf.prop === name
                )
              : entities.every((e) =>
                  keyframes.find(
                    (kf) => kf.time === currentTime && kf.entityId === e.id && kf.prop === name
                  )
                )

          return (
            <label
              key={name}
              className='input cursor-pointer flex flex-row justify-between items-center w-[200px]'
            >
              <span className='label'>{name}</span>
              <Input type={type} propName={name} onPropChange={onPropChange} value={value} />
              <button
                className='btn btn-xs p-1 m-0'
                onClick={() => onKf(name)}
                style={{
                  backgroundColor: isKfed ? 'var(--color-red-900)' : undefined,
                }}
              >
                KF
              </button>
            </label>
          )
        })}
    </div>
  )
}

function Input({
  type,
  propName,
  onPropChange,
  value,
}: {
  type: 'color' | 'number'
  propName: EntityPropName
  onPropChange: (propName: EntityPropName, value: number | string) => void
  value: number | string | undefined
}) {
  switch (type) {
    case 'color':
      return (
        <input
          type='color'
          className='w-[40px] h-[40px] cursor-pointer p-2 '
          value={value}
          onChange={(e) => onPropChange(propName, e.target.value)}
        />
      )
    case 'number':
      return (
        <NumberInput
          value={(value as number) ?? 0}
          setValue={(v) => onPropChange(propName, v)}
          step={0.1}
          min={-1000}
          max={1000}
        />
      )
    default:
      return <span>${type} is not implemented</span>
  }
}

function getEntitiesProps(entities: Entity[]): PropDescription[] {
  const entityTypes = new Set(entities.map((e) => e.type))
  // instances are different
  const props = [...entityTypes].reduce(
    (result, entityType) => result.intersection(new Set(entityTypeToProps[entityType])),
    new Set(entityTypeToProps[entityTypes.values().next().value!])
  )

  return [...props]
}
