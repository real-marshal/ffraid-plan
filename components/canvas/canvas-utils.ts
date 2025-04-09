import { Entity } from './canvas-state'
import { v4 as uuid } from 'uuid'
import { height, width } from '@/components/canvas/canvas'

export function makeEntity(type: Entity['type']): Entity {
  switch (type) {
    case 'melee':
      return {
        id: uuid(),
        type: 'melee',
        initialParams: { opacity: 1, fill: 'red', x: width / 2, y: height / 2 },
      }
    case 'ranged':
      return {
        id: uuid(),
        type: 'ranged',
        initialParams: { opacity: 1, fill: 'darkred', x: width / 2, y: height / 2 },
      }
    case 'healer':
      return {
        id: uuid(),
        type: 'healer',
        initialParams: { opacity: 1, fill: 'green', x: width / 2, y: height / 2 },
      }
    case 'tank':
      return {
        id: uuid(),
        type: 'melee',
        initialParams: { opacity: 1, fill: 'blue', x: width / 2, y: height / 2 },
      }
    case 'rect':
      return {
        id: uuid(),
        type: 'rect',
        initialParams: { opacity: 1, fill: '#ffffff', x: width / 2, y: height / 2 },
      }
    case 'circle':
      return {
        id: uuid(),
        type: 'circle',
        initialParams: { opacity: 1, fill: 'white', x: width / 2, y: height / 2 },
      }
    default:
      throw new Error(`Unknown type ${type}`)
  }
}
