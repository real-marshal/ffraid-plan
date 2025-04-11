import { CoreState, Entity, EntityPropName, EntityProps, Kf } from './canvas-state'
import { height, width } from '@/components/canvas/canvas'
import { nanoid } from 'nanoid'
import { compressBrotli, round, uncompressBrotli } from '@/utils'
import { toByteArray, fromByteArray } from 'base64-js'
import { encode, decode } from '@msgpack/msgpack'
import { CSSProperties } from 'react'

export function makeEntity(type: Entity['type']): Entity {
  switch (type) {
    case 'melee':
      return {
        id: nanoid(4),
        type: 'melee',
        props: {
          opacity: 1,
          fill: 'red',
          x: width / 2,
          y: height / 2,
          width: 30,
          height: 30,
          rotation: 0,
        },
      }
    case 'ranged':
      return {
        id: nanoid(4),
        type: 'ranged',
        props: {
          opacity: 1,
          fill: 'darkred',
          x: width / 2,
          y: height / 2,
          width: 30,
          height: 30,
          rotation: 0,
        },
      }
    case 'healer':
      return {
        id: nanoid(4),
        type: 'healer',
        props: {
          opacity: 1,
          fill: 'green',
          x: width / 2,
          y: height / 2,
          width: 30,
          height: 30,
          rotation: 0,
        },
      }
    case 'tank':
      return {
        id: nanoid(4),
        type: 'melee',
        props: {
          opacity: 1,
          fill: 'blue',
          x: width / 2,
          y: height / 2,
          width: 30,
          height: 30,
          rotation: 0,
        },
      }
    case 'rect':
      return {
        id: nanoid(4),
        type: 'rect',
        props: {
          opacity: 1,
          fill: '#ffffff',
          x: width / 2,
          y: height / 2,
          width: 30,
          height: 30,
          rotation: 0,
        },
      }
    case 'circle':
      return {
        id: nanoid(4),
        type: 'circle',
        props: {
          opacity: 1,
          fill: '#ffffff',
          x: width / 2,
          y: height / 2,
          radius: 15,
          rotation: 0,
        },
      }
    case 'arrow':
      return {
        id: nanoid(4),
        type: 'arrow',
        props: {
          opacity: 1,
          stroke: '#ffffff',
          x: width / 2,
          y: height / 2,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
      }
    default:
      throw new Error(`Unknown type ${type}`)
  }
}

// type WaapiKf = {
//   offset: number
// } & CSSProperties

export interface WaapiEntity {
  type: Entity['type']
  duration: number
  initialValues: CSSProperties
  keyframes: Keyframe[]
}

const konvaPropToWaapiProp: Partial<Record<EntityPropName, keyof CSSProperties>> = {
  fill: 'backgroundColor',
  stroke: 'fill',
}

// uses top/left & width/height atm, not transforms
// example output
// [{"type":"rect","duration":3,"keyframes":[{"backgroundColor":"#ffffff","left":"15.67%","top":"15.83%","width":"5%","height":"5%","rotate":"0deg"},{"offset":1,"backgroundColor":"#26a269","left":"72.83%","top":"36.67%","width":"13.92%","height":"13.92%","rotate":"-180deg"},{"offset":2,"left":"49.12%","top":"55.08%","width":"43.06%","height":"6.76%","rotate":"-162.9deg"}],"initialValues":{"transform":"translate(-50%,-50%)","left":"15.67%","top":"15.83%","width":"5%","height":"5%","opacity":1,"backgroundColor":"#ffffff","rotate":"0deg"}}]
export function kfsToWaapi(
  entities: Entity[],
  passedKeyframes: Kf[],
  duration: number
): WaapiEntity[] {
  if (!entities.length || !passedKeyframes.length) {
    return []
  }

  return entities.map((e) => {
    const kfedProps: Set<keyof CSSProperties> = new Set()

    const keyframes = passedKeyframes.toSorted((a, b) => a.time - b.time)

    const waapiKeyframes = keyframes
      .filter((kf) => kf.entityId === e.id)
      .reduce((result, kf) => {
        const offset = round(kf.time / duration)
        const waapiPropValue: Partial<Record<keyof CSSProperties, number | string>> = {}

        switch (kf.prop) {
          case 'x': {
            waapiPropValue['left'] = round(((kf.value as number) / width) * 100) + '%'
            break
          }
          case 'y': {
            waapiPropValue['top'] = round(((kf.value as number) / height) * 100) + '%'
            break
          }
          case 'width': {
            waapiPropValue['width'] = round(((kf.value as number) / width) * 100) + '%'
            break
          }
          case 'height': {
            waapiPropValue['height'] = round(((kf.value as number) / height) * 100) + '%'
            break
          }
          case 'radius': {
            waapiPropValue['width'] = round((((kf.value as number) * 2) / height) * 100) + '%'
            waapiPropValue['height'] = round((((kf.value as number) * 2) / width) * 100) + '%'
            break
          }
          case 'rotation': {
            waapiPropValue['rotate'] = (kf.value as number) + 'deg'
            break
          }
          case 'scaleX': {
            const prevScaleYKf = keyframes.findLast(
              (prevKf) =>
                prevKf.entityId === e.id && prevKf.prop === 'scaleY' && prevKf.time <= kf.time
            )
            waapiPropValue['scale'] = `${kf.value} ${prevScaleYKf?.value ?? 1}`
            break
          }
          case 'scaleY': {
            const prevScaleXKf = keyframes.findLast(
              (prevKf) =>
                prevKf.entityId === e.id && prevKf.prop === 'scaleX' && prevKf.time <= kf.time
            )
            waapiPropValue['scale'] = `${prevScaleXKf?.value ?? 1} ${kf.value}`
            break
          }
          default: {
            const propName = konvaPropToWaapiProp[kf.prop] ?? (kf.prop as keyof CSSProperties)

            waapiPropValue[propName] = kf.value
          }
        }

        const ind = result.findIndex((kfToFind) => kfToFind.offset === offset)

        // if already added, then just add to the existing kf
        if (ind >= 0) {
          // @ts-expect-error fuck you
          result[ind] = { ...result[ind], ...waapiPropValue }
        } else {
          result.push({ ...waapiPropValue, offset })
        }

        Object.keys(waapiPropValue).forEach((prop) => kfedProps.add(prop as keyof CSSProperties))

        return result
      }, [] as Keyframe[])
      .sort((a, b) => a.offset! - b.offset!)

    if (waapiKeyframes.length && waapiKeyframes.at(-1)!.offset !== 1) {
      waapiKeyframes.push({ offset: 1 })
    }

    const lastKf = waapiKeyframes.at(-1)

    // making sure that kfed props don't start shifting to their initial values until the end of the whole animation
    for (const kfedProp of kfedProps) {
      const kf = waapiKeyframes.findLast((kf) => kfedProp in kf)!

      if (kf.offset !== 1) {
        // @ts-expect-error makes no sense whatsoever
        lastKf[kfedProp] = kf[kfedProp]
      }
    }

    waapiKeyframes?.[0] && delete waapiKeyframes[0].offset

    const initialValues: Omit<Partial<EntityProps>, 'width' | 'height' | 'opacity'> &
      CSSProperties = {
      ...e.props,
      position: 'absolute',
      // compensating for origin shift
      translate: '-50% -50%',
      // for the case when they weren't kf'd
      left: round((e.props.x / width) * 100) + '%',
      top: round((e.props.y / height) * 100) + '%',
      width:
        round(
          (((e.props.width ?? e.type === 'circle')
            ? e.props.radius! * 2
            : e.type === 'arrow'
              ? 110
              : NaN) /
            width) *
            100
        ) + '%',
      height:
        round(
          (((e.props.height ?? e.type === 'circle')
            ? e.props.radius! * 2
            : e.type === 'arrow'
              ? 40
              : NaN) /
            height) *
            100
        ) + '%',
      rotate: e.props.rotation + 'deg',
      ...(waapiKeyframes?.[0] as Omit<CSSProperties, 'offset'>),
    }

    if (e.type === 'circle') {
      initialValues.borderRadius = '50%'
    }

    if (e.type === 'arrow') {
      delete initialValues.height
    }

    delete initialValues.x
    delete initialValues.y
    delete initialValues.radius
    delete initialValues.rotation
    delete initialValues.scaleX
    delete initialValues.scaleY

    for (const konvaProp in konvaPropToWaapiProp) {
      // @ts-expect-error crazy bitch
      initialValues[konvaPropToWaapiProp[konvaProp as EntityPropName]!] = (
        initialValues as Partial<EntityProps>
      )[konvaProp as EntityPropName]
      delete (initialValues as Partial<EntityProps>)[konvaProp as EntityPropName]
    }

    return {
      type: e.type,
      duration: duration * 1000,
      keyframes: waapiKeyframes,
      initialValues,
    }
  })
}

export async function stateToBase64(entities: Entity[], keyframes: Kf[], duration: number) {
  const storedState = {
    entities,
    keyframes,
    duration,
  }

  const compressed = await compressBrotli(encode(storedState))

  return fromByteArray(compressed).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function base64ToState(base64: string): Promise<CoreState> {
  const properBase64 =
    base64.length % 4 !== 0 ? base64 + '='.repeat(4 - (base64.length % 4)) : base64
  const data = toByteArray(properBase64.replace(/-/g, '+').replace(/_/g, '/'))

  const msgpack = await uncompressBrotli(data)

  return decode(msgpack) as CoreState
}
