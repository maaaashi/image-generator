import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

export const Images = () => {
  const [pastImages, setPastImages] = useState<
    { original: string; thumbnail: string }[]
  >([])

  const listImages = async () => {
    const responose = await fetch('/api/listGeneratedImages', {
      method: 'POST',
    })
    const blobs = await responose.json()

    setPastImages(
      blobs.map((b: any) => {
        return {
          original: b.url,
          thumbnail: b.url,
        }
      })
    )
  }

  useEffect(() => {
    listImages()
  })

  return (
    <div className='w-full flex justify-center'>
      <ImageGallery items={pastImages} />
    </div>
  )
}
