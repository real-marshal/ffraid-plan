import { Entity, EntityPropName, Kf } from '@/components/canvas/canvas-state'
import { NumberInput } from '@/components/number-input'
import { height, width } from '@/components/canvas/external-state'

export type PropType = 'color' | 'number'

export interface PropDescription {
  name: EntityPropName
  type: PropType
  min?: number
  max?: number
}

const baseProps: PropDescription[] = [
  { name: 'opacity', type: 'number', min: 0, max: 1 },
  { name: 'x', type: 'number', min: -width, max: width * 2 },
  { name: 'y', type: 'number', min: -height, max: height * 2 },
  { name: 'rotation', type: 'number', min: -360 * 10, max: 360 * 10 },
]

const roleProps: PropDescription[] = [
  ...baseProps,
  { name: 'width', type: 'number', min: 0, max: width },
  { name: 'height', type: 'number', min: 0, max: height },
]

export const entityTypeToProps: Record<Entity['type'], PropDescription[]> = {
  melee: roleProps,
  ranged: roleProps,
  healer: roleProps,
  tank: roleProps,
  rect: [
    ...baseProps,
    { name: 'width', type: 'number', min: 0, max: width },
    { name: 'height', type: 'number', min: 0, max: height },
    { name: 'fill', type: 'color' },
  ],
  circle: [...baseProps, { name: 'radius', type: 'number' }, { name: 'fill', type: 'color' }],
  arrow: [
    ...baseProps,
    { name: 'fill', type: 'color' },
    { name: 'scaleX', type: 'number', min: 0, max: 100 },
    { name: 'scaleY', type: 'number', min: 0, max: 100 },
  ],
  triangle: [
    ...baseProps,
    { name: 'fill', type: 'color' },
    { name: 'scaleX', type: 'number', min: 0, max: 100 },
    { name: 'scaleY', type: 'number', min: 0, max: 100 },
  ],
  ring: [
    ...baseProps,
    { name: 'fill', type: 'color' },
    { name: 'innerRadius', type: 'number', min: 10, max: width / 2 },
    { name: 'outerRadius', type: 'number', min: 15, max: width },
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
        props.map(({ name, type, min, max }) => {
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
              className='input cursor-pointer flex flex-row justify-between items-center w-[230px]'
            >
              <span className='label'>{name}</span>
              <Input
                type={type}
                propName={name}
                onPropChange={onPropChange}
                value={value}
                min={min}
                max={max}
              />
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
  min,
  max,
}: {
  type: 'color' | 'number'
  propName: EntityPropName
  onPropChange: (propName: EntityPropName, value: number | string) => void
  value: number | string | undefined
  min?: number
  max?: number
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
          min={min ?? 0}
          max={max ?? 1000}
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
