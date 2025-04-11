export function Menu({
  className,
  onClear,
  onWaapiExport,
  onLinkExport,
}: {
  className?: string
  onClear: () => void
  onWaapiExport: () => void
  onLinkExport: () => void
}) {
  return (
    <ul
      className={`flex flex-row justify-between w-full menu menu-horizontal bg-base-200 rounded-box ${className}`}
    >
      <li>
        <button onClick={() => confirm('Clear everything?') && onClear()}>Clear</button>
      </li>
      <div className='flex flex-row'>
        <li>
          <button onClick={() => onLinkExport()}>Export link</button>
        </li>
        <li>
          <button onClick={() => onWaapiExport()}>Export WAAPI</button>
        </li>
        <li className='self-end justify-self-end'>
          <label>
            <span className='label'>Auto KF</span>
            <input
              type='checkbox'
              className='checkbox'
              checked={true}
              onChange={() => alert('Cant disable yet')}
            />
          </label>
        </li>
      </div>
    </ul>
  )
}
