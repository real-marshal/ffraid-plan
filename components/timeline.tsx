import { NumberInput } from '@/components/number-input'

export function Timeline({
  onPlay,
  onPause,
  isPlaying = false,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  fps,
  setFps,
}: {
  onPlay: (duration: number) => void
  onPause: (duration: number) => void
  isPlaying?: boolean
  currentTime: number
  setCurrentTime: (currentTime: number) => void
  duration: number
  setDuration: (duration: number) => void
  fps: number
  setFps: (duration: number) => void
}) {
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
          }}
          step={0.1}
        />
        <div className='flex justify-between px-2.5 text-xs'>
          {Array(Math.ceil(duration + 1))
            .fill(0)
            .map((_, ind) => (
              <span key={ind} className='scale-y-[0.5]'>
                |
              </span>
            ))}
        </div>
        <div className='flex justify-between px-2.5 text-xs'>
          {Array(Math.ceil(duration + 1))
            .fill(0)
            .map((_, ind) => (
              <span key={ind}>{ind}</span>
            ))}
        </div>
        <div className='grid grid-cols-[1fr_auto_1fr] items-center w-full mt-2'>
          <button
            className='btn btn-md w-[100px]'
            onClick={() => (isPlaying ? onPause(duration) : onPlay(duration))}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span className='col-start-2 font-bold'>{currentTime}s</span>
          <div className='col-start-3 justify-self-end flex flex-row gap-1'>
            <label className='select select-sm w-[100px]'>
              <span className='label me-0!'>fps</span>
              <select
                className='select select-sm'
                value={fps}
                onChange={(e) => setFps(Number.parseInt(e.target.value))}
              >
                <option>10</option>
                <option>30</option>
              </select>
            </label>
            <label className='input w-[130px] input-sm'>
              <span className='label me-0!'>duration</span>
              <NumberInput value={duration} setValue={setDuration} step={0.1} min={1} max={30} />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
