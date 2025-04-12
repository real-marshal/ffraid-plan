'use client'

import { CSSProperties, useEffect, useRef } from 'react'
import { Arrow, Triangle } from '@/components/svg'

const num = 10

const waapiObj = [
  {
    type: 'triangle',
    duration: 3000,
    keyframes: [],
    initialValues: {
      opacity: 0.6,
      fill: '#c64600',
      position: 'absolute',
      translate: '-50% -50%',
      left: '41.33%',
      top: '54.17%',
      width: '13.33%',
      rotate: '90deg',
      scale: '2.35 3.15',
    },
  },
]
export default function TestPage() {
  const redDiv = useRef<HTMLDivElement>(null)
  const tanks = useRef<(HTMLImageElement | null)[]>([])
  const waapiObjRefs = useRef<(HTMLDivElement | SVGSVGElement | null)[]>([])

  useEffect(() => {
    console.log('alter')

    tanks.current.forEach((tank) => {
      tank!.animate(
        [
          {
            // top: `${Math.round(Math.random() * 500)}px`,
            // left: `${Math.round(Math.random() * 500)}px`,
            transform: `translate(${Math.round(Math.random() * 500)}px, ${Math.round(Math.random() * 500)}px)`,
            // translate: `${Math.round(Math.random() * 500)}px, ${Math.round(Math.random() * 500)}px`,
            scale: Math.round(Math.random()),
            opacity: Math.round(Math.random()),
          },
          {
            // top: `${Math.round(Math.random() * 50)}%`,
            // left: `${Math.round(Math.random() * 50)}%`,
            transform: `translate(${Math.round(Math.random() * 500)}px, ${Math.round(Math.random() * 500)}px)`,
            // translate: `${Math.round(Math.random() * 500)}px, ${Math.round(Math.random() * 500)}px`,
            scale: Math.round(Math.random()),
            opacity: Math.round(Math.random()),
          },
        ],
        { duration: 3000, iterations: Infinity }
      )
    })

    redDiv
      .current!.animate(
        [
          {
            // scale: 1,
            transform: 'scale(1)',
          },
          {
            // scale: 2,
            transform: 'scale(2)',
          },
          {
            // scale: 2,
            transform: 'scale(1)',
          },
        ],
        { duration: 3000, iterations: Infinity }
      )
      .play()

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
      {Array(num)
        .fill(0)
        .map((_, ind) => {
          return (
            <img
              key={ind}
              ref={(ref) => {
                tanks.current[ind] = ref
              }}
              src='https://ffraid.tips/optimized-images/tank.58f152c2-opt-256.WEBP'
              alt='tank'
              className='absolute'
            />
          )
        })}
      <div ref={redDiv} className='bg-[red] w-[30px] h-[30px] absolute top-[30%] left-[20%]'></div>
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
