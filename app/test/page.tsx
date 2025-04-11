'use client'

import { useEffect, useRef } from 'react'

const num = 10

const waapiObj = [
  {
    type: 'circle',
    duration: 3000,
    keyframes: [
      { width: '5%', height: '5%' },
      { width: '33.5%', height: '33.5%', offset: 0.4 },
      { offset: 1, width: '33.5%', height: '33.5%' },
    ],
    initialValues: {
      opacity: 1,
      position: 'absolute',
      transform: 'translate(-50%,-50%)',
      left: '50%',
      top: '50%',
      width: '5%',
      height: '5%',
      rotate: '0deg',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },
  },
]

export default function TestPage() {
  const redDiv = useRef<HTMLDivElement>(null)
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
        <div
          key={ind}
          className='absolute'
          style={entity.initialValues}
          ref={(ref) => {
            waapiObjRefs.current[ind] = ref
          }}
        ></div>
      ))}
    </div>
  )
}
