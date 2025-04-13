import { HexAlphaColorPicker } from 'react-colorful'
import { useState } from 'react'

export function ColorInput({
  value,
  onChange,
}: {
  value?: string
  onChange: (value: string) => void
}) {
  const [pickerValue, setPickerValue] = useState(value)

  return (
    <div className='dropdown dropdown-center cursor-pointer'>
      <div
        tabIndex={0}
        role='button'
        className='w-[30px] h-[30px] rounded-sm border-1 border-[#00000099] dark:border-[#ffffff99]'
        style={{ backgroundColor: value }}
      ></div>
      <div tabIndex={0} className='dropdown-content'>
        <HexAlphaColorPicker
          color={pickerValue}
          onChange={(value) => {
            setPickerValue(value)
            onChange(value)
          }}
        />
      </div>
    </div>
  )
}
