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
