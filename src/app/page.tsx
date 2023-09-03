'use client'

import { Header } from '@/components/Header'
import { FormEvent, useState } from 'react'

export default function Home() {
  const [promptState, setPromptState] = useState('Cats owned by wealthy people')
  const [imageBinary, setImageBinary] = useState('')
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()

    if (process.env.NODE_ENV === 'production') {
      const results = await fetch('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({
          prompt: promptState,
        }),
      })

      const json = await results.json()
      const buffer = Buffer.from(json.images[0].buffer.data)
      const base64 = buffer.toString('base64')

      setImageBinary('data:image/png;base64,' + base64)
    } else {
      setTimeout(() => {
        setImageBinary('/mockImage.png')
      }, 2000)
    }
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
          <button className='btn btn-primary self-end' onSubmit={submitHandler}>
            画像生成！
          </button>
        </form>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className='flex justify-center p-5'>
          {imageBinary ? <img src={imageBinary} alt='generate-image' /> : <></>}
        </div>
      </main>
    </>
  )
}
