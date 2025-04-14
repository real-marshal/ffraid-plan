'use client'

import { CSSProperties, useEffect, useRef } from 'react'
import { Arrow, Triangle } from '@/components/svg'
import { WaapiEntity } from '@/components/canvas/canvas-utils'

const waapiObj: WaapiEntity[] = [
  {
    type: 'checkerboard',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        position: 'absolute',
        translate: '-50% -50%',
        left: '50.17%',
        top: '49.83%',
        width: '80%',
        height: '80%',
        rotate: '0deg',
        backgroundSize: '20cqi 20cqi',
        backgroundImage: 'repeating-conic-gradient(#ffffff00 0% 25%, #ff000054 0% 50%)',
        scale: '1 1',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { opacity: 0, offset: 0.5 },
      { offset: 1, opacity: 0 },
    ],
    initialValues: {
      opacity: 1,
      position: 'absolute',
      translate: '-50% -50%',
      left: '50.17%',
      top: '49.83%',
      width: '80%',
      height: '80%',
      rotate: '0deg',
      backgroundSize: '20cqi 20cqi',
      backgroundImage: 'repeating-conic-gradient(#ffffff00 0% 25%, #ff000054 0% 50%)',
      scale: '1 1',
    },
  },
  {
    type: 'checkerboard',
    duration: 6000,
    keyframes: [
      {
        opacity: 0,
        position: 'absolute',
        translate: '-50% -50%',
        left: '50.33%',
        top: '49.83%',
        width: '80%',
        height: '80%',
        rotate: '90deg',
        backgroundSize: '20cqi 20cqi',
        backgroundImage: 'repeating-conic-gradient(#ffffff00 0% 25%, #ff000054 0% 50%)',
        scale: '1 1',
        offset: 0,
      },
      { opacity: 0, offset: 0.42 },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1 },
    ],
    initialValues: {
      opacity: 0,
      position: 'absolute',
      translate: '-50% -50%',
      left: '50.33%',
      top: '49.83%',
      width: '80%',
      height: '80%',
      rotate: '90deg',
      backgroundSize: '20cqi 20cqi',
      backgroundImage: 'repeating-conic-gradient(#ffffff00 0% 25%, #ff000054 0% 50%)',
      scale: '1 1',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '25%',
      top: '25%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '25.17%',
      top: '74.83%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '75%',
      top: '24.67%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '74.83%',
      top: '74.83%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '35%',
      top: '54.83%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '55%',
      top: '64.83%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '45.17%',
      top: '35%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'circle',
    duration: 6000,
    keyframes: [],
    initialValues: {
      opacity: 0.75,
      position: 'absolute',
      translate: '-50% -50%',
      left: '65%',
      top: '44.83%',
      width: '8.33%',
      height: '8.33%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
  {
    type: 'rect',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '9.42%',
        height: '9.42%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '35.17%',
        top: '54.83%',
        rotate: '0deg',
        outlineWidth: '0.83cqi',
        outlineOffset: '-0.42cqi',
        outlineStyle: 'solid',
        backgroundColor: '#ffffff00',
        outlineColor: '#16f600',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '35.17%', offset: 0.43, top: '54.83%' },
      { opacity: 0, offset: 0.45, left: '65.17%', top: '54.83%' },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '65.17%', top: '54.83%' },
    ],
    initialValues: {
      opacity: 1,
      width: '9.42%',
      height: '9.42%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '35.17%',
      top: '54.83%',
      rotate: '0deg',
      outlineWidth: '0.83cqi',
      outlineOffset: '-0.42cqi',
      outlineStyle: 'solid',
      backgroundColor: '#ffffff00',
      outlineColor: '#16f600',
    },
  },
  {
    type: 'rect',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '9.42%',
        height: '9.42%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '44.83%',
        top: '64.83%',
        rotate: '0deg',
        outlineWidth: '0.83cqi',
        outlineOffset: '-0.42cqi',
        outlineStyle: 'solid',
        backgroundColor: '#ffffff00',
        outlineColor: '#16f600',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '44.83%', offset: 0.43, top: '64.83%' },
      { opacity: 0, offset: 0.45, left: '55.17%', top: '64.67%' },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '55.17%', top: '64.67%' },
    ],
    initialValues: {
      opacity: 1,
      width: '9.42%',
      height: '9.42%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '44.83%',
      top: '64.83%',
      rotate: '0deg',
      outlineWidth: '0.83cqi',
      outlineOffset: '-0.42cqi',
      outlineStyle: 'solid',
      backgroundColor: '#ffffff00',
      outlineColor: '#16f600',
    },
  },
  {
    type: 'melee',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '5%',
        height: '5%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '42.33%',
        top: '59.83%',
        rotate: '0deg',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '42.33%', offset: 0.43, top: '59.83%' },
      { left: '62%', offset: 0.45, top: '59.67%', opacity: 0 },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '62%', top: '59.67%' },
    ],
    initialValues: {
      opacity: 1,
      width: '5%',
      height: '5%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '42.33%',
      top: '59.83%',
      rotate: '0deg',
    },
  },
  {
    type: 'tank',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '5%',
        height: '5%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '37.17%',
        top: '59.83%',
        rotate: '0deg',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '37.17%', offset: 0.43, top: '59.83%' },
      { left: '57.33%', offset: 0.45, top: '59.67%', opacity: 0 },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '57.33%', top: '59.67%' },
    ],
    initialValues: {
      opacity: 1,
      width: '5%',
      height: '5%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '37.17%',
      top: '59.83%',
      rotate: '0deg',
    },
  },
  {
    type: 'rect',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '9.42%',
        height: '9.42%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '65.17%',
        top: '44.67%',
        rotate: '0deg',
        outlineWidth: '0.83cqi',
        outlineOffset: '-0.42cqi',
        outlineStyle: 'solid',
        backgroundColor: '#ffffff00',
        outlineColor: '#16f600',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '65.17%', offset: 0.43, top: '44.67%' },
      { opacity: 0, offset: 0.45, left: '35.33%', top: '45.17%' },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '35.33%', top: '45.17%' },
    ],
    initialValues: {
      opacity: 1,
      width: '9.42%',
      height: '9.42%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '65.17%',
      top: '44.67%',
      rotate: '0deg',
      outlineWidth: '0.83cqi',
      outlineOffset: '-0.42cqi',
      outlineStyle: 'solid',
      backgroundColor: '#ffffff00',
      outlineColor: '#16f600',
    },
  },
  {
    type: 'rect',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '9.42%',
        height: '9.42%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '55%',
        top: '35%',
        rotate: '0deg',
        outlineWidth: '0.83cqi',
        outlineOffset: '-0.42cqi',
        outlineStyle: 'solid',
        backgroundColor: '#ffffff00',
        outlineColor: '#16f600',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '55%', offset: 0.43, top: '35%' },
      { opacity: 0, offset: 0.45, left: '44.83%', top: '35%' },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '44.83%', top: '35%' },
    ],
    initialValues: {
      opacity: 1,
      width: '9.42%',
      height: '9.42%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '55%',
      top: '35%',
      rotate: '0deg',
      outlineWidth: '0.83cqi',
      outlineOffset: '-0.42cqi',
      outlineStyle: 'solid',
      backgroundColor: '#ffffff00',
      outlineColor: '#16f600',
    },
  },
  {
    type: 'melee',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '5%',
        height: '5%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '63%',
        top: '39.33%',
        rotate: '0deg',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '63%', offset: 0.43, top: '39.33%' },
      { left: '41.67%', offset: 0.45, top: '40%', opacity: 0 },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '41.67%', top: '40%' },
    ],
    initialValues: {
      opacity: 1,
      width: '5%',
      height: '5%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '63%',
      top: '39.33%',
      rotate: '0deg',
    },
  },
  {
    type: 'tank',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        width: '5%',
        height: '5%',
        position: 'absolute',
        translate: '-50% -50%',
        left: '57.83%',
        top: '39.33%',
        rotate: '0deg',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { left: '57.83%', offset: 0.43, top: '39.33%' },
      { left: '36.83%', offset: 0.45, top: '39.83%', opacity: 0 },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1, left: '36.83%', top: '39.83%' },
    ],
    initialValues: {
      opacity: 1,
      width: '5%',
      height: '5%',
      position: 'absolute',
      translate: '-50% -50%',
      left: '57.83%',
      top: '39.33%',
      rotate: '0deg',
    },
  },
  {
    type: 'text',
    duration: 6000,
    keyframes: [
      {
        opacity: 1,
        fontSize: '8.33cqi',
        position: 'absolute',
        left: '6.17%',
        top: '1.33%',
        rotate: '0deg',
        scale: '1 1',
        transformOrigin: 'top left',
        lineHeight: 0.77,
        color: '#ffffff',
        offset: 0,
      },
      { opacity: 1, offset: 0.42 },
      { opacity: 0, offset: 0.5 },
      { offset: 1, opacity: 0 },
    ],
    initialValues: {
      opacity: 1,
      fontSize: '8.33cqi',
      position: 'absolute',
      left: '6.17%',
      top: '1.33%',
      rotate: '0deg',
      scale: '1 1',
      transformOrigin: 'top left',
      lineHeight: 0.77,
      color: '#ffffff',
    },
    specialValues: { text: '1 possible configuration' },
  },
  {
    type: 'text',
    duration: 6000,
    keyframes: [
      {
        opacity: 0,
        fontSize: '8.33cqi',
        position: 'absolute',
        left: '6%',
        top: '1.33%',
        rotate: '0deg',
        scale: '1 1',
        transformOrigin: 'top left',
        lineHeight: 0.77,
        color: '#ffffff',
        offset: 0,
      },
      { opacity: 0, offset: 0.42 },
      { opacity: 1, offset: 0.5 },
      { offset: 1, opacity: 1 },
    ],
    initialValues: {
      opacity: 0,
      fontSize: '8.33cqi',
      position: 'absolute',
      left: '6%',
      top: '1.33%',
      rotate: '0deg',
      scale: '1 1',
      transformOrigin: 'top left',
      lineHeight: 0.77,
      color: '#ffffff',
    },
    specialValues: { text: '2 possible configuration' },
  },
]
//   [{
//     type: 'rect',
//     duration: 3000,
//     keyframes: [],
//     initialValues: {
//       opacity: 1,
//       width: '5%',
//       height: '5%',
//       position: 'absolute',
//       translate: '-50% -50%',
//       left: '26.5%',
//       top: '35.5%',
//       rotate: '0deg',
//       backgroundColor: '#3fb45d66',
//       outlineColor: '#ca6d6d',
//     },
//   },
//   {
//     type: 'rect',
//     duration: 3000,
//     keyframes: [
//       { width: '19.24%', offset: 0, height: '19.73%', rotate: '0deg' },
//       { width: '54.69%', offset: 0.33, height: '14.68%', outlineColor: '#000000', rotate: '45deg' },
//       { outlineColor: '#de2424', offset: 0.5 },
//       { outlineWidth: '5cqi', outlineOffset: '-2.5cqi', offset: 0.67 },
//       {
//         outlineWidth: '1.67cqi',
//         outlineOffset: '-0.83cqi',
//         offset: 1,
//         width: '54.69%',
//         height: '14.68%',
//         rotate: '45deg',
//         outlineColor: '#de2424',
//       },
//     ],
//     initialValues: {
//       opacity: 1,
//       width: '19.24%',
//       height: '19.73%',
//       position: 'absolute',
//       translate: '-50% -50%',
//       left: '28.67%',
//       top: '33%',
//       rotate: '0deg',
//       outlineWidth: '5cqi',
//       outlineOffset: '-2.5cqi',
//       outlineStyle: 'solid',
//       offset: 0,
//       backgroundColor: '#ffffff00',
//       outlineColor: '#000000',
//     },
//   },
//   {
//     type: 'checkerboard',
//     duration: 3000,
//     keyframes: [
//       { opacity: 1, offset: 0 },
//       { opacity: 1, offset: 0.3 },
//       { opacity: 0, offset: 0.33 },
//       { offset: 1, opacity: 0 },
//     ],
//     initialValues: {
//       opacity: 1,
//       position: 'absolute',
//       translate: '-50% -50%',
//       left: '50.33%',
//       top: '50%',
//       width: '78.67%',
//       height: '78.67%',
//       rotate: '0deg',
//       backgroundSize: '19.67cqi 19.67cqi',
//       backgroundImage: 'repeating-conic-gradient(#ffffff00 0% 25%, #ffffff7a 0% 50%)',
//       scale: '1 1',
//       offset: 0,
//     },
//   },
//   {
//     type: 'checkerboard',
//     duration: 3000,
//     keyframes: [
//       { opacity: 0, offset: 0 },
//       { opacity: 0, offset: 0.3 },
//       { opacity: 1, offset: 0.33 },
//       { offset: 1, opacity: 1 },
//     ],
//     initialValues: {
//       opacity: 0,
//       position: 'absolute',
//       translate: '-50% -50%',
//       left: '50.33%',
//       top: '50%',
//       width: '78.67%',
//       height: '78.67%',
//       rotate: '0deg',
//       backgroundSize: '19.67cqi 19.67cqi',
//       backgroundImage: 'repeating-conic-gradient(#ffffff8a 0% 25%, #ffffff00 0% 50%)',
//       scale: '1 1',
//       offset: 0,
//     },
//   },
// ]
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
                {entity.specialValues!.text}
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
