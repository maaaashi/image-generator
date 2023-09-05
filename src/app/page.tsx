'use client'

import { Header } from '@/components/Header'
import { postGenerateImageAPI } from '@/libs/postGenerateImage'
import { FormEvent, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export type Binary = {
  prompt: string
  data: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [promptState, setPromptState] = useState('富裕層が飼っている猫')
  const [draw, setDraw] = useState('')
  const [imageBinaries, setImageBinaries] = useState<Binary[]>([])
  const [imageBinary, setImageBinary] = useState<Binary>()
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()

    const confirm = await Swal.fire({
      title: `${draw}「${promptState}」を生成します。`,
      icon: 'info',
      showCancelButton: true,
    })

    if (!confirm.isConfirmed) return

    setLoading(true)

    const binary = await postGenerateImageAPI(promptState, draw)

    if (!binary) return

    setImageBinaries((c) => [...c, binary])
    setLoading(false)
  }

  const viewImage = () => {
    if (loading)
      return <span className='loading loading-infinity loading-lg'></span>

    if (!imageBinary) return <></>
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageBinary.data} alt='generate-image' />
  }

  useEffect(() => {
    setDraw('リアルな')
  }, [])

  useEffect(() => {
    setImageBinary(imageBinaries[imageBinaries.length - 1])
  }, [imageBinaries])

  return (
    <>
      <Header />
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
            {imageBinaries.map((binary, index) => {
              return (
                <div key={index}>
                  <button
                    className='btn'
                    onClick={() => {
                      setImageBinary(binary)
                    }}
                  >
                    {index + 1}: {binary.prompt}
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
