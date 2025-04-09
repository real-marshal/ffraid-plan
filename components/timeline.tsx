import { useState } from 'react'
import { Keyframes } from '@/components/canvas/canvas-state'

export function Timeline({
  onTimeChange,
  onPlay,
  onPause,
  isPlaying = false,
  keyframes,
  currentTime,
  setCurrentTime,
}: {
  onTimeChange: (currentTime: number) => void
  onPlay: (duration: number) => void
  onPause: (duration: number) => void
  isPlaying?: boolean
  keyframes: Keyframes
  currentTime: number
  setCurrentTime: (currentTime: number) => void
}) {
  const [duration, setDuration] = useState(3)

  return (
    <div className='row-start-3 col-start-2 mt-2'>
      <div className='w-full relative'>
        <input
          type='range'
          className='range w-full'
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            const time = Number.parseFloat(e.target.value)
            setCurrentTime(time)
            onTimeChange(time)
          }}
          step={0.1}
        />
        {[...keyframes.keys()].map((kfTime) => (
          <span
            key={kfTime}
            className='absolute top-6 text-sm font-bold -translate-x-1/2 text-center'
            style={{ left: `${Math.round((kfTime / duration) * 100)}%` }}
          >
            KF
          </span>
        ))}
        <div className='flex justify-between px-2.5 mt-2 text-xs'>
          {Array(Math.ceil(duration + 1))
            .fill(0)
            .map((_, ind) => (
              <span key={ind}>|</span>
            ))}
        </div>
        <div className='flex justify-between px-2.5 mt-2 text-xs'>
          {Array(Math.ceil(duration + 1))
            .fill(0)
            .map((_, ind) => (
              <span key={ind}>{ind}</span>
            ))}
        </div>
        <div className='grid grid-cols-[1fr_auto_1fr] items-center w-full mt-2'>
          <button
            className='btn btn-md w-[150px]'
            onClick={() => (isPlaying ? onPause(duration) : onPlay(duration))}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span className='col-start-2'>{currentTime}s</span>
          <label className='input w-[200px] col-start-3 justify-self-end'>
            <span className='label'>Set duration: </span>
            <input
              type='number'
              value={duration}
              onChange={(e) => setDuration(Number.parseFloat(e.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
