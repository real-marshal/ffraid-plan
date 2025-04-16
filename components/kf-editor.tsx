import { width } from '@/components/canvas/external-state'
import { round } from '@/utils'
import { Kf, KfsByEntity } from '@/components/canvas/canvas-state'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'

export function KfEditor({
  keyframesByEntity,
  onKfMove,
  duration,
}: {
  keyframesByEntity: KfsByEntity
  onKfMove: (id: string, newTime: number) => void
  duration: number
}) {
  const [selectedKfIds, setSelectedKfIds] = useState<string[]>([])

  return (
    <div
      className='row-start-4 col-span-2 grid grid-cols-subgrid'
      onClick={() => {
        setSelectedKfIds([])
      }}
    >
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
              <Row
                key={entityId + prop}
                kfs={kfs}
                duration={duration}
                onKfMove={onKfMove}
                setSelectedKfIds={setSelectedKfIds}
                selectedKfIds={selectedKfIds}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

function Row({
  kfs,
  duration,
  onKfMove,
  setSelectedKfIds,
  selectedKfIds,
}: {
  kfs: Kf[]

  onKfMove: (id: string, newTime: number) => void
  duration: number
  setSelectedKfIds: Dispatch<SetStateAction<string[]>>
  selectedKfIds: string[]
}) {
  const [relativeX, setRelativeX] = useState(0)

  return (
    <div
      className='relative h-[20px] last:border-b-1 border-t-1 border-neutral-content dark:border-[#444] bg-base-200'
      onMouseMove={(e) => {
        const relativeX = e.clientX - (window.innerWidth - width) / 2

        setRelativeX(relativeX)
      }}
      onMouseLeave={() => {
        setRelativeX(0)
      }}
    >
      {kfs.map((kf) => (
        <KfMarker
          key={kf.id}
          duration={duration}
          id={kf.id}
          time={kf.time}
          onKfMove={onKfMove}
          setSelectedKfIds={setSelectedKfIds}
          selectedKfIds={selectedKfIds}
          siblingKfIds={kfs.map((kf) => kf.id)}
        />
      ))}
      {relativeX !== 0 && (
        <span
          className='border-r-8 absolute -translate-x-1/2 h-full w-[1px] opacity-50 z-[1]'
          style={{
            left: `${Math.round((round((relativeX / width) * duration, 1) / duration) * 100)}%`,
          }}
        >
          <div className='absolute top-[-35px] bg-base-200 p-2'>
            {round((relativeX / width) * duration, 1)}s
          </div>
        </span>
      )}
    </div>
  )
}

function KfMarker({
  duration,
  id,
  time,
  onKfMove,
  setSelectedKfIds,
  selectedKfIds,
  siblingKfIds,
}: {
  duration: number
  id: string
  time: number
  onKfMove: (id: string, newTime: number) => void
  setSelectedKfIds: Dispatch<SetStateAction<string[]>>
  selectedKfIds: string[]
  siblingKfIds: string[]
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <span
      className={`kf-marker absolute text-sm font-bold -translate-x-1/2 text-center select-none cursor-grab hover:scale-[1.3] z-[2]  ${selectedKfIds.includes(id) ? 'scale-[1.3]' : ''}`}
      style={{
        left: `${Math.round((time / duration) * 100)}%`,
        // scale: selectedKfIds.includes(id) ? 1.3 : 'none',
      }}
      draggable
      onDragEnd={(e) => {
        const relativeX = e.clientX - (window.innerWidth - width) / 2

        selectedKfIds.forEach((kf) => {
          onKfMove(kf, round((relativeX / width) * duration, 1))
        })
      }}
      onMouseOver={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      onClick={(e) => {
        e.stopPropagation()

        if (e.shiftKey) {
          setSelectedKfIds((ids) =>
            siblingKfIds.every((siblingKfId) => ids.includes(siblingKfId))
              ? ids.filter((idToFilter) => !siblingKfIds.includes(idToFilter))
              : [...new Set([...ids, ...siblingKfIds])]
          )
        } else {
          setSelectedKfIds((ids) =>
            ids.includes(id) ? ids.filter((idToFilter) => idToFilter !== id) : [...ids, id]
          )
        }
      }}
    >
      {isHovered && <div className='absolute top-[-35px] bg-base-200 p-2'>{time}s</div>}
      <span className='border-r-8'></span>
    </span>
  )
}
