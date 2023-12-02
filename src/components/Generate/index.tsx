'use client'

import { Image } from '@/Domains/Image'
import { ImageUsecase } from '@/Usecases/ImageUsecase'
import { FormEvent, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export type Binary = {
  prompt: string
  data: string
}

export const Generate = () => {
  const [loading, setLoading] = useState(false)
  const [promptState, setPromptState] = useState('富裕層が飼っている猫')
  const [draw, setDraw] = useState('')
  const [imageState, setImageState] = useState<Image[]>([])
  const [imageUrl, setImageUrl] = useState<string>('')
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()

    const confirm = await Swal.fire({
      title: `${draw}「${promptState}」を生成します。`,
      icon: 'info',
      showCancelButton: true,
    })

    if (!confirm.isConfirmed) return

    setLoading(true)

    const imageUsecase = new ImageUsecase()
    const image = await imageUsecase.generateImage({
      prompt: promptState,
      draw: draw,
    })

    if (!image.url) return

    setImageState((c) => [...c, image])
    setLoading(false)
  }

  const viewImage = () => {
    if (loading)
      return <span className='loading loading-infinity loading-lg'></span>

    if (!imageUrl) return <></>
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt='generate-image' />
  }

  useEffect(() => {
    setDraw('リアルな')
  }, [])

  useEffect(() => {
    const lastImage = imageState[imageState.length - 1]

    if (!lastImage) return

    setImageUrl(lastImage.url)
  }, [imageState])

  return (
    <>
      <main className='container mx-auto mt-5'>
        <form onSubmit={submitHandler} className='flex flex-col gap-5'>
          <div className='flex gap-5'>
            {['リアルな', '漫画風に'].map((d, index) => {
              return (
                <label
                  className='flex items-center gap-3 cursor-pointer hover:font-bold p-1'
                  key={index}
                >
                  <div>{d}</div>
                  <input
                    type='radio'
                    name='radio-2'
                    className='radio radio-primary'
                    value={d}
                    onChange={(e) => {
                      setDraw(e.target.value)
                    }}
                    checked={d === draw}
                  />
                </label>
              )
            })}
          </div>
          <div className='flex'>
            <textarea
              className='textarea textarea-bordered flex-1'
              placeholder='Type Prompt'
              value={promptState}
              onChange={(e) => {
                setPromptState(e.target.value)
              }}
              rows={1}
              required
            ></textarea>
            <button
              className='btn btn-primary self-end disabled:btn-disabled'
              onSubmit={submitHandler}
              disabled={loading}
            >
              画像生成！
            </button>
          </div>
        </form>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className='flex justify-center p-5 gap-5'>
          <div className='border p-5 shadow bg-base-200'>{viewImage()}</div>
          <div className='flex flex-col gap-2 items-center'>
            <p className='font-bold'>履歴</p>
            {imageState.map(({ binary, prompt, draw, url }, index) => {
              return (
                <div key={index}>
                  <button
                    className='btn'
                    onClick={() => {
                      setImageUrl(url)
                    }}
                  >
                    {index + 1}: {draw}「{prompt}」
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
