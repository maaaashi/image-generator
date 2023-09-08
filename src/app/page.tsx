'use client'

import { Generate } from '@/components/Generate'
import { Header } from '@/components/Header'
import { Images } from '@/components/Images'
import React, { useState } from 'react'

const Home = () => {
  const [mode, setMode] = useState<'generate' | 'images'>('generate')

  const view = () => {
    switch (mode) {
      case 'generate':
        return <Generate />
      case 'images':
        return <Images />
    }
  }

  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='btn-group w-full'>
        <button
          className={`w-1/2 btn ${mode === 'generate' ? 'btn-active' : ''}`}
          onClick={() => {
            setMode('generate')
          }}
        >
          Generate
        </button>
        <button
          className={`w-1/2 btn ${mode === 'images' ? 'btn-active' : ''}`}
          onClick={() => {
            setMode('images')
          }}
        >
          Generated Images
        </button>
      </div>
      {view()}
    </div>
  )
}

export default Home
