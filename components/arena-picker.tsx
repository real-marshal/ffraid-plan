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
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 text-center border-2 p-2 cursor-pointer hover:bg-gray-700'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag & drop an arena image or click to open the file dialog</p>
      </div>
    </div>
  )
}
