import { useEffect, useRef, useState } from 'react'
import { externalState } from '@/components/canvas/external-state'

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
  const wasCorrected = useRef(false)

  useEffect(() => {
    if (wasCorrected.current) {
      wasCorrected.current = false
      return
    }

    setValueStr(passedValue.toString())
  }, [passedValue])

  return (
    <input
      type='number'
      value={valueStr}
      step={step}
      onFocus={() => (externalState.isInputting = true)}
      onBlur={() => (externalState.isInputting = false)}
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

        if (value !== parsedValue) {
          wasCorrected.current = true
        }

        setPassedValue(value)
      }}
    />
  )
}
