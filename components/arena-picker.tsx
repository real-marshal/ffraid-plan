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
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 text-center border-1 cursor-pointer bg-gray-800 hover:bg-gray-900 rounded-md'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p className='p-2 leading-5 text-sm'>
          Drag & drop an arena image or click to open the file dialog.
          <br />
          The image won't be exported.
        </p>
      </div>
    </div>
  )
}
