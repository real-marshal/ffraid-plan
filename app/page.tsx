import { Canvas } from '@/components/canvas/canvas'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main className='flex flex-col gap-10 items-center justify-center'>
      <h1>ffraid plan</h1>
      <Suspense>
        <Canvas />
      </Suspense>
    </main>
  )
}
