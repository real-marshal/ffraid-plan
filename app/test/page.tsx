'use client'

import { CSSProperties, Ref, useEffect, useRef } from 'react'

const num = 10

const waapiObj = [
  {
    type: 'arrow',
    duration: 3000,
    keyframes: [
      { scale: '1 1', rotate: '0deg', top: '2.33%', left: '8.67%' },
      { left: '3.5%', offset: 0.33, top: '71.67%', scale: '3.45 1', rotate: '-90deg' },
      { left: '50.5%', offset: 0.67, top: '6.5%', scale: '0.76 6.33', rotate: '90deg' },
      { offset: 1, scale: '0.76 6.33', rotate: '90deg', top: '6.5%', left: '50.5%' },
    ],
    initialValues: {
      opacity: 1,
      position: 'absolute',
      translate: '-50% -50%',
      left: '8.67%',
      top: '2.33%',
      width: '18.33%',
      rotate: '0deg',
      scale: '1 1',
      fill: '#ffffff',
    },
  },
]

export default function TestPage() {
  const redDiv = useRef<HTMLDivElement | SVGSVGElement>(null)
  const tanks = useRef<(HTMLImageElement | null)[]>([])
  const waapiObjRefs = useRef<(HTMLDivElement | null)[]>([])

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
      waapiObjRefs
        .current![
          ind
        ]!.animate(entity.keyframes, { duration: entity.duration, iterations: Infinity })
        .play()
    })
  }, [])

  return (
    <div className='relative w-[500px] h-[500px]'>
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
      {waapiObj.map((entity, ind) => (
        <Arrow
          key={ind}
          // className='absolute'
          className='top-50 left-50 -translate-x-1/2 -translate-y-1/2 absolute w-[110px] h-[40px] before:border-t-15 before:border-t-[var(--ff-arrow-color)] before:border-b-15 before:border-b-transparent before:border-l-15 before:border-l-transparent before:border-r-15 before:border-r-transparent before:inline-block before:absolute before:-rotate-90 before:left-[100px] before:top-[50%] before:-translate-y-1/2 before:scale-[1_2] after:top-[50%] after:-translate-y-1/2 after:h-[10px] after:w-[90px] after:bg-[var(--ff-arrow-color)] after:absolute after:inline-block'
          style={entity.initialValues as CSSProperties}
          ref={(ref) => {
            waapiObjRefs.current[ind] = ref
          }}
        ></Arrow>
      ))}
      <div className='top-50 left-50 -translate-x-1/2 -translate-y-1/2 absolute w-[110px] h-[40px] before:border-t-15 before:border-t-[rgba(50,100,200,1)] before:border-b-15 before:border-b-transparent before:border-l-15 before:border-l-transparent before:border-r-15 before:border-r-transparent before:inline-block before:absolute before:-rotate-90 before:left-[100px] before:top-[50%] before:-translate-y-1/2 before:scale-[1_2] after:top-[50%] after:-translate-y-1/2 after:h-[10px] after:w-[90px] after:bg-[rgba(50,100,200,1)] after:absolute after:inline-block'></div>
    </div>
  )
}

// http://localhost:3000/?s=G0cDIIyU7iLLBuf2nf5GpRLF2--YS9VMdM-E7qXTCxkt6K5OG98NUoBKA987kpRSLRMLhivgg3-InvSdm9fqKrpKVEd_6xxj-WqqmopVhp11KrolCWluW20VY7tQuVxo7IrlQrEyOBQafQT7SrVcyMQOX-DHqiletZBjuVBtYA3tc2qcYO9c4JSJtUKbKoseweqkmBBn21LRWRwuMtoKqqGdzBhA2ARtoqngorKkXuprfCyAqEBE9GPVeg0IKRfWDJImiBkd-XgEAbDJRMjUlrTmN7jPN1G10RIhguWJMTrxGMqWtJRk6HpEyWc1R_QI6t--SI1UEIBmBlsB3peFfCnvG-GYO3jyCkNNgEXopn-P8zBzhGLZkg81Y76LN7Na9whv7mO0Vr6IWA

function Arrow({
  style,
  ref,
}: {
  style: CSSProperties
  className?: string
  ref: Ref<SVGSVGElement>
}) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 514 293' ref={ref} style={style}>
      <path
        d='M 26.00,125.12
           C 26.00,125.12 350.25,125.38 350.25,125.38
             350.25,125.38 350.00,68.88 350.00,68.88
             350.00,68.88 506.82,146.82 506.82,146.82
             506.82,146.82 350.18,225.36 350.18,225.36
             350.18,225.36 350.12,168.62 350.12,168.62
             350.12,168.62 26.18,168.18 26.18,168.18
             26.18,168.18 26.00,125.12 26.00,125.12 Z'
      />
    </svg>
  )
}
