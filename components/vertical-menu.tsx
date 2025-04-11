export function VerticalMenu({
  className,
  onMeleeAdd,
  onRangedAdd,
  onHealerAdd,
  onTankAdd,
  onRectAdd,
  onCircAdd,
}: {
  className?: string
  onMeleeAdd: () => void
  onRangedAdd: () => void
  onHealerAdd: () => void
  onTankAdd: () => void
  onRectAdd: () => void
  onCircAdd: () => void
}) {
  return (
    <ul className={`menu bg-base-200 rounded-box ${className}`}>
      <button className='btn btn-sm' onClick={onCircAdd}>
        circ
      </button>
      <button className='btn btn-sm' onClick={onRectAdd}>
        rect
      </button>
      <button className='btn btn-sm' onClick={onMeleeAdd}>
        M
      </button>
      <button className='btn btn-sm' onClick={onRangedAdd}>
        R
      </button>
      <button className='btn btn-sm' onClick={onHealerAdd}>
        H
      </button>
      <button className='btn btn-sm' onClick={onTankAdd}>
        T
      </button>
    </ul>
  )
}
