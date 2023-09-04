'use client'

import { Header } from '@/components/Header'
import { FormEvent, useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [promptState, setPromptState] = useState('富裕層が飼っている猫')
  const [imageBinary, setImageBinary] = useState('')
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)

    if (process.env.NODE_ENV === 'production') {
      let condition = true
      let response: Response | undefined = undefined

      while (condition) {
        try {
          const res = await fetch('/api/generate-image', {
            method: 'POST',
            body: JSON.stringify({
              prompt: promptState,
            }),
          })
          if (res.status === 200) {
            response = res
            condition = false
          }
        } catch (error) {
          console.log('error')
        }
      }

      if (!response) return

      const json = await response.json()
      const buffer = Buffer.from(json.images[0].buffer.data)
      const base64 = buffer.toString('base64')

      setImageBinary('data:image/png;base64,' + base64)
      setLoading(false)
    } else {
      setTimeout(() => {
        setImageBinary('/mockImage.png')
        setLoading(false)
      }, 4000)
    }
  }

  const viewImage = () => {
    if (loading)
      return <span className='loading loading-infinity loading-lg'></span>

    if (!imageBinary) return <></>
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageBinary} alt='generate-image' />
  }

  return (
    <>
      <Header />
      <main className='container mx-auto mt-5'>
        <form onSubmit={submitHandler} className='flex'>
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
        </form>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className='flex justify-center p-5'>{viewImage()}</div>
      </main>
    </>
  )
}
