export function Menu({ className, onClear }: { className?: string; onClear: () => void }) {
  return (
    <ul
      className={`flex flex-row justify-between w-full menu menu-horizontal bg-base-200 rounded-box ${className}`}
    >
      <li>
        <button onClick={() => confirm('Clear everything?') && onClear()}>Clear</button>
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
    </ul>
  )
}
