import { CSSProperties } from 'react'

export function ContextMenu({
  className,
  style,
  onDelete,
}: {
  className?: string
  style?: CSSProperties
  onDelete: () => void
}) {
  return (
    <ul
      className={`absolute menu menu-vertical bg-base-200 rounded-box ${className}`}
      style={style}
    >
      <li>
        <button onClick={onDelete}>Delete</button>
      </li>
    </ul>
  )
}
