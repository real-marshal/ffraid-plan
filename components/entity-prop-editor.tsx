import { Entity, EntityPropName, Kf } from '@/components/canvas/canvas-state'
import { NumberInput } from '@/components/number-input'
import { externalState, height, width } from '@/components/canvas/external-state'
import { ColorInput } from '@/components/color-input'
import { useState } from 'react'

export type PropType = 'color' | 'number' | 'string'

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
    { name: 'stroke', type: 'color' },
    { name: 'strokeWidth', type: 'number' },
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
  text: [
    ...baseProps,
    { name: 'fill', type: 'color' },
    { name: 'text', type: 'string' },
    { name: 'fontSize', type: 'number', min: 10, max: 300 },
    { name: 'scaleX', type: 'number', min: 0, max: 100 },
    { name: 'scaleY', type: 'number', min: 0, max: 100 },
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
            <Input
              key={name}
              type={type}
              propName={name}
              onPropChange={onPropChange}
              value={value}
              min={min}
              max={max}
              isKfed={!!isKfed}
              onKf={onKf}
            />
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
  isKfed,
  onKf,
}: {
  type: PropType
  propName: EntityPropName
  onPropChange: (propName: EntityPropName, value: number | string) => void
  value: number | string | undefined
  min?: number
  max?: number
  isKfed: boolean
  onKf: (propName: EntityPropName) => void
}) {
  const [zIndex, setZIndex] = useState(0)

  const isKfable = type !== 'string'

  return (
    <span
      className='input cursor-default flex flex-row justify-between items-center w-[230px]'
      style={{ zIndex }}
      onFocus={() => setZIndex(999)}
      onBlur={() => setZIndex(0)}
    >
      <span className='label'>{propName}</span>
      <InputElement
        type={type}
        propName={propName}
        onPropChange={onPropChange}
        value={value}
        min={min}
        max={max}
      />
      {isKfable && (
        <button
          className='btn btn-xs p-1 m-0'
          onClick={() => onKf(propName)}
          style={{
            backgroundColor: isKfed ? 'var(--color-red-900)' : undefined,
          }}
        >
          KF
        </button>
      )}
    </span>
  )
}

function InputElement({
  type,
  propName,
  onPropChange,
  value,
  min,
  max,
}: {
  type: PropType
  propName: EntityPropName
  onPropChange: (propName: EntityPropName, value: number | string) => void
  value: number | string | undefined
  min?: number
  max?: number
}) {
  switch (type) {
    case 'color':
      return (
        <ColorInput
          value={value as string | undefined}
          onChange={(value) => onPropChange(propName, value)}
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
    case 'string':
      return (
        <input
          type='text'
          className=''
          onFocus={() => (externalState.isInputting = true)}
          onBlur={() => (externalState.isInputting = false)}
          value={value}
          onChange={(e) => onPropChange(propName, e.target.value)}
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
