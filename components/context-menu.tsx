import { CSSProperties } from 'react'

export function ContextMenu({
  className,
  style,
  onDelete,
  onCopy,
  onPaste,
  isPastable,
}: {
  className?: string
  style?: CSSProperties
  onDelete: () => void
  onCopy: () => void
  onPaste: () => void
  isPastable: boolean
}) {
  return (
    <ul
      className={`absolute menu menu-vertical bg-base-200 rounded-box ${className}`}
      style={style}
    >
      <li>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onCopy}>Copy</button>
        {isPastable && <button onClick={onPaste}>Paste</button>}
      </li>
    </ul>
  )
}
