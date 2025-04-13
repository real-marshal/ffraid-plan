import { Entity } from '@/components/canvas/canvas-state'

export function VerticalMenu({
  className,
  onEntityAdd,
}: {
  className?: string
  onEntityAdd: (type: Entity['type']) => void
}) {
  return (
    <ul className={`flex flex-col rounded-box ${className} items-end gap-1`}>
      <button className='btn btn-sm w-[40px]' onClick={() => onEntityAdd('text')}>
        text
      </button>
      <button className='btn btn-sm w-[40px]' onClick={() => onEntityAdd('ring')}>
        ring
      </button>
      <button className='btn btn-sm w-[40px]' onClick={() => onEntityAdd('triangle')}>
        trin
      </button>
      <button className='btn btn-sm w-[40px]' onClick={() => onEntityAdd('arrow')}>
        arrw
      </button>
      <button className='btn btn-sm w-[40px]' onClick={() => onEntityAdd('circle')}>
        circ
      </button>
      <button className='btn btn-sm w-[40px]' onClick={() => onEntityAdd('rect')}>
        rect
      </button>
      <span className='mt-1'></span>
      <button className='btn btn-sm btn-square' onClick={() => onEntityAdd('melee')}>
        M
      </button>
      <button className='btn btn-sm btn-square' onClick={() => onEntityAdd('ranged')}>
        R
      </button>
      <button className='btn btn-sm btn-square' onClick={() => onEntityAdd('healer')}>
        H
      </button>
      <button className='btn btn-sm btn-square' onClick={() => onEntityAdd('tank')}>
        T
      </button>
    </ul>
  )
}
