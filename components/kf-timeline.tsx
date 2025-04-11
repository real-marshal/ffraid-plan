import { width } from '@/components/canvas/canvas'
import { clamp } from '@/utils'
import { KfsByEntity } from '@/components/canvas/canvas-state'
import { Fragment, useState } from 'react'

export function KfTimeline({
  keyframesByEntity,
  onKfMove,
  duration,
}: {
  keyframesByEntity: KfsByEntity
  onKfMove: (prevTime: number, newTime: number) => void
  duration: number
}) {
  return (
    <div className='row-start-4 col-span-2 grid grid-cols-subgrid'>
      {Object.entries(keyframesByEntity).map(([entityId, propKfs]) => (
        <Fragment key={entityId}>
          <div className='col-start-1 flex flex-col'>
            <span className='h-[25px] mt-2'>{entityId}</span>
            {Object.keys(propKfs).map((prop) => (
              <span
                key={entityId + prop}
                className='label text-sm h-[20px] last:border-b-1 border-t-1 border-neutral-content dark:border-[#444] bg-base-200'
              >
                {prop}
              </span>
            ))}
          </div>
          <div className='col-start-2'>
            <span className='invisible h-[25px] mt-2 inline-block'>{entityId}</span>
            {Object.entries(propKfs).map(([prop, kfs]) => (
              <div
                key={entityId + prop}
                className='relative h-[20px] last:border-b-1 border-t-1 border-neutral-content dark:border-[#444] bg-base-200'
              >
                {kfs.map((kf) => (
                  <KfMarker
                    key={kf.id}
                    duration={duration}
                    id={kf.id}
                    time={kf.time}
                    onKfMove={onKfMove}
                  />
                ))}
              </div>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export function KfMarker({
  duration,
  time,
  onKfMove,
}: {
  duration: number
  id: string
  time: number
  onKfMove: (prevTime: number, newTime: number) => void
}) {
  const [draggingMouseX, setDraggingMouseX] = useState(0)

  return (
    <span
      className='absolute text-sm font-bold -translate-x-1/2 text-center select-none'
      style={{
        left: draggingMouseX
          ? clamp(draggingMouseX, 0, width)
          : `${Math.round((time / duration) * 100)}%`,
      }}
      draggable
      onDragEnd={(e) => {
        const relativeX = e.clientX - (window.innerWidth - width) / 2

        setDraggingMouseX(relativeX)
        onKfMove(time, Math.round((relativeX / width) * duration * 10) / 10)
      }}
    >
      KF
    </span>
  )
}
