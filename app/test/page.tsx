'use client'

import { CSSProperties, useEffect, useRef } from 'react'
import { Arrow, Triangle } from '@/components/svg'

const waapiObj = [
  {
    type: 'rect',
    duration: 3000,
    keyframes: [],
    initialValues: {
      opacity: 1,
      width: '5%',
      height: '5%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '26.5%',
      top: '35.5%',
      rotate: '0deg',
      backgroundColor: '#3fb45d66',
      outlineColor: '#ca6d6d',
    },
  },
  {
    type: 'rect',
    duration: 3000,
    keyframes: [
      { width: '19.24%', offset: 0, height: '19.73%', rotate: '0deg' },
      { width: '54.69%', offset: 0.33, height: '14.68%', outlineColor: '#000000', rotate: '45deg' },
      { outlineColor: '#de2424', offset: 0.5 },
      { outlineWidth: '5cqi', outlineOffset: '-2.5cqi', offset: 0.67 },
      {
        outlineWidth: '1.67cqi',
        outlineOffset: '-0.83cqi',
        offset: 1,
        width: '54.69%',
        height: '14.68%',
        rotate: '45deg',
        outlineColor: '#de2424',
      },
    ],
    initialValues: {
      opacity: 1,
      width: '19.24%',
      height: '19.73%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '28.67%',
      top: '33%',
      rotate: '0deg',
      outlineWidth: '5cqi',
      outlineOffset: '-2.5cqi',
      outlineStyle: 'solid',
      offset: 0,
      backgroundColor: '#ffffff00',
      outlineColor: '#000000',
    },
  },
  {
    type: 'checkerboard',
    duration: 3000,
    keyframes: [
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: 0.3 },
      { opacity: 0, offset: 0.33 },
      { offset: 1, opacity: 0 },
    ],
    initialValues: {
      opacity: 1,
      position: 'absolute',
      translate: '-50% -50%',
      left: '50.33%',
      top: '50%',
      width: '78.67%',
      height: '78.67%',
      rotate: '0deg',
      backgroundSize: '19.67cqi 19.67cqi',
      backgroundImage: 'repeating-conic-gradient(#ffffff00 0% 25%, #ffffff7a 0% 50%)',
      scale: '1 1',
      offset: 0,
    },
  },
  {
    type: 'checkerboard',
    duration: 3000,
    keyframes: [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: 0.3 },
      { opacity: 1, offset: 0.33 },
      { offset: 1, opacity: 1 },
    ],
    initialValues: {
      opacity: 0,
      position: 'absolute',
      translate: '-50% -50%',
      left: '50.33%',
      top: '50%',
      width: '78.67%',
      height: '78.67%',
      rotate: '0deg',
      backgroundSize: '19.67cqi 19.67cqi',
      backgroundImage: 'repeating-conic-gradient(#ffffff8a 0% 25%, #ffffff00 0% 50%)',
      scale: '1 1',
      offset: 0,
    },
  },
]
export default function TestPage() {
  const waapiObjRefs = useRef<(HTMLElement | SVGElement | null)[]>([])

  useEffect(() => {
    waapiObj.forEach((entity, ind) => {
      console.log('playing next')
      waapiObjRefs.current![ind]!.animate(entity.keyframes, {
        duration: entity.duration,
        iterations: Infinity,
      })
    })
  }, [])

  return (
    <div className='relative w-[500px] h-[500px] @container'>
      <img
        src='https://ffraid.tips/optimized-images/anf_hector.e43ba258-opt-640.WEBP'
        alt='alt'
        className='absolute'
      />
      {waapiObj.map((entity, ind) => {
        switch (entity.type) {
          case 'arrow':
            return (
              <Arrow
                key={ind}
                style={entity.initialValues as CSSProperties}
                ref={(ref) => {
                  waapiObjRefs.current[ind] = ref
                }}
              />
            )
          case 'triangle':
            return (
              <Triangle
                key={ind}
                style={entity.initialValues as CSSProperties}
                ref={(ref) => {
                  waapiObjRefs.current[ind] = ref
                }}
              />
            )
          case 'text':
            return (
              <span
                key={ind}
                style={entity.initialValues as CSSProperties}
                ref={(ref) => {
                  waapiObjRefs.current[ind] = ref
                }}
              >
                {entity.specialValues.text}
              </span>
            )
          default:
            return (
              <div
                key={ind}
                style={entity.initialValues as CSSProperties}
                ref={(ref) => {
                  waapiObjRefs.current[ind] = ref
                }}
              ></div>
            )
        }
      })}
    </div>
  )
}

// http://localhost:3000/?s=G0cDIIyU7iLLBuf2nf5GpRLF2--YS9VMdM-E7qXTCxkt6K5OG98NUoBKA987kpRSLRMLhivgg3-InvSdm9fqKrpKVEd_6xxj-WqqmopVhp11KrolCWluW20VY7tQuVxo7IrlQrEyOBQafQT7SrVcyMQOX-DHqiletZBjuVBtYA3tc2qcYO9c4JSJtUKbKoseweqkmBBn21LRWRwuMtoKqqGdzBhA2ARtoqngorKkXuprfCyAqEBE9GPVeg0IKRfWDJImiBkd-XgEAbDJRMjUlrTmN7jPN1G10RIhguWJMTrxGMqWtJRk6HpEyWc1R_QI6t--SI1UEIBmBlsB3peFfCnvG-GYO3jyCkNNgEXopn-P8zBzhGLZkg81Y76LN7Na9whv7mO0Vr6IWA

// function Ring({
//   style,
//   ref,
// }: {
//   style: CSSProperties
//   className?: string
//   ref: Ref<SVGSVGElement>
// }) {
//   // w,h = (innerRadius * 2) / canvasW/H
//   // outline = (outerRadius - innerRadius) / canvasW/H
//   return (
//     <div className='absolute w-[50%] h-[50%] bg-transparent -translate-1/2 rounded-full box-content border-[25cqi] border-[red]'></div>
//     // <div className='absolute w-[100%] h-[100%] bg-[red] -translate-1/2 rounded-full after:block after:bg-transparent after:w-[400px] after:h-[400px] after:absolute after:z-[100]'></div>
//   )
// }

// ring
// {
//   translate: -50% -50%;
//   font-size: 10em;
//   display: inline-block;
//   width: 200px;
//   box-sizing: content-box;
//   height: 200px;
//   border: 0px solid red;
//   border-radius:50%;
//   position: relative;
//   outline: 100px solid;
//   outline-offset: 0px;
// }
