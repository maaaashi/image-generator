'use client'

import { FormEvent, useState } from 'react'

export default function Home() {
  const [promptState, setPromptState] = useState('Cats owned by wealthy people')
  const [imageBinary, setImageBinary] = useState('')
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()

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
    // const str = json.images[0].filePath
    // const regex =
    // /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.*\.png)$/

    // const match = str.match(regex)
    // if (match) {
    //   setImagePath('/' + match[1])
    // } else {
    //   console.log('No match found')
    // }
  }

  return (
    <main className='container mx-auto'>
      {process.env.NODE_ENV}
      <form onSubmit={submitHandler} className='flex'>
        <textarea
          className='textarea textarea-bordered'
          placeholder='Type Prompt'
          value={promptState}
          onChange={(e) => {
            setPromptState(e.target.value)
          }}
          required
        ></textarea>
        <button className='btn btn-primary self-end' onSubmit={submitHandler}>
          画像生成！
        </button>
      </form>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageBinary ? <img src={imageBinary} alt='generate-image' /> : <></>}
    </main>
  )
}
