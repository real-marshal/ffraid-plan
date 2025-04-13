import { CSSProperties, Ref } from 'react'

export interface SVGDimensions {
  width: number
  height: number
}

export const arrowPathData = `M 0.00,16.00
           C 0.00,16.00 95.00,16.00 95.00,16.00
             95.00,16.00 95.00,0.00 95.00,0.00
             95.00,0.00 142.00,22.00 142.00,22.00
             142.00,22.00 95.00,44.00 95.00,44.00
             95.00,44.00 95.00,28.00 95.00,28.00
             95.00,28.00 0.00,28.00 0.00,28.00
             0.00,28.00 0.00,16.00 0.00,16.00 Z`

export const arrowDimensions: SVGDimensions = { width: 142, height: 44 }

export function Arrow({ style, ref }: { style?: CSSProperties; ref?: Ref<SVGSVGElement> }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 142 44' style={style} ref={ref}>
      <path d={arrowPathData} />
    </svg>
  )
}

export const trianglePathData = `M 0.00,130.00
C 0.00,130.00 40.00,0.00 40.00,0.00
40.00,0.00 80.00,130.00 80.00,130.00
80.00,130.00 0.00,130.00 0.00,130.00 Z`

export const triangleDimensions: SVGDimensions = { width: 80, height: 130 }

export function Triangle({ style, ref }: { style?: CSSProperties; ref?: Ref<SVGSVGElement> }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 130' style={style} ref={ref}>
      <path d={trianglePathData} />
    </svg>
  )
}

export function DragHandle({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 20 20' width='12' className={className}>
      <path d='M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z'></path>
    </svg>
  )
}
