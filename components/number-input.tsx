import { useEffect, useState } from 'react'

export function NumberInput({
  value: passedValue,
  setValue: setPassedValue,
  min,
  max,
  step,
}: {
  value: number
  setValue: (value: number) => void
  min: number
  max: number
  step: number
}) {
  const [valueStr, setValueStr] = useState(passedValue.toString())

  useEffect(() => {
    setValueStr(passedValue.toString())
  }, [passedValue])

  return (
    <input
      type='number'
      value={valueStr}
      step={step}
      onChange={(e) => {
        const { value: valueStr } = e.target
        setValueStr(valueStr)

        const parsedValue = Number.parseFloat(valueStr)
        const value =
          Number.isNaN(parsedValue) || parsedValue < min
            ? min
            : parsedValue > max
              ? max
              : parsedValue

        setPassedValue(value)
      }}
    />
  )
}
