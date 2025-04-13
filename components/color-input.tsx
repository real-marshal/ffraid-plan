import { HexAlphaColorPicker } from 'react-colorful'

export function ColorInput({
  value,
  onChange,
}: {
  value?: string
  onChange: (value: string) => void
}) {
  return (
    <div className='dropdown dropdown-center cursor-pointer'>
      <div
        tabIndex={0}
        role='button'
        className='w-[30px] h-[30px] rounded-sm border-1 border-[#00000099] dark:border-[#ffffff99]'
        style={{ backgroundColor: value }}
      ></div>
      <div tabIndex={0} className='dropdown-content'>
        <HexAlphaColorPicker color={value} onChange={onChange} />
      </div>
    </div>
  )
}
