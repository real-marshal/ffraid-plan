import { CSSProperties, Ref } from 'react'

export const arrowPathData = `M 26.00,125.12
C 26.00,125.12 350.25,125.38 350.25,125.38
350.25,125.38 350.00,68.88 350.00,68.88
350.00,68.88 506.82,146.82 506.82,146.82
506.82,146.82 350.18,225.36 350.18,225.36
350.18,225.36 350.12,168.62 350.12,168.62
350.12,168.62 26.18,168.18 26.18,168.18
26.18,168.18 26.00,125.12 26.00,125.12 Z`

export function Arrow({ style, ref }: { style?: CSSProperties; ref?: Ref<SVGSVGElement> }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 514 293' style={style} ref={ref}>
      <path fill='white' d={arrowPathData} />
    </svg>
  )
}

export const trianglePathData = `M 0.00,130.00
C 0.00,130.00 40.00,0.00 40.00,0.00
40.00,0.00 80.00,130.00 80.00,130.00
80.00,130.00 0.00,130.00 0.00,130.00 Z`

export function Triangle({ style, ref }: { style?: CSSProperties; ref?: Ref<SVGSVGElement> }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 130' style={style} ref={ref}>
      <path fill='white' d={trianglePathData} />
    </svg>
  )
}
