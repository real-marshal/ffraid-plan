import { useDropzone } from 'react-dropzone'

export function ArenaPicker({ onPick }: { onPick: (arena: ImageBitmap) => void }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const [file] = files

      createImageBitmap(file)
        .then(onPick)
        .catch((err) => console.error(err))
    },
  })

  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 text-center border-2 cursor-pointer bg-gray-700 hover:bg-gray-800'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p className='p-2'>Drag & drop an arena image or click to open the file dialog</p>
      </div>
    </div>
  )
}
