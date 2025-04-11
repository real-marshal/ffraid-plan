import { Entity } from '@/components/canvas/canvas-state'

export function VerticalMenu({
  className,
  onEntityAdd,
}: {
  className?: string
  onEntityAdd: (type: Entity['type']) => void
}) {
  return (
    <ul className={`menu bg-base-200 rounded-box ${className}`}>
      <button className='btn btn-sm' onClick={() => onEntityAdd('arrow')}>
        arrw
      </button>
      <button className='btn btn-sm' onClick={() => onEntityAdd('circle')}>
        circ
      </button>
      <button className='btn btn-sm' onClick={() => onEntityAdd('rect')}>
        rect
      </button>
      <button className='btn btn-sm' onClick={() => onEntityAdd('melee')}>
        M
      </button>
      <button className='btn btn-sm' onClick={() => onEntityAdd('ranged')}>
        R
      </button>
      <button className='btn btn-sm' onClick={() => onEntityAdd('healer')}>
        H
      </button>
      <button className='btn btn-sm' onClick={() => onEntityAdd('tank')}>
        T
      </button>
    </ul>
  )
}
