import { Handler } from 'aws-lambda'
import { generateAsync } from 'stability-client'
import { put } from '@vercel/blob'

type Input = {
  prompt: string
}

export const handler: Handler = async (req) => {
  const { prompt } = JSON.parse(req.body) as Input

  try {
    // @ts-ignore
    const { images } = await generateAsync({
      prompt,
      apiKey: process.env.DREAM_STUDIO_APIKEY!,
      outDir: '/tmp/generated/',
      steps: 50,
    })

    const filePath = images[0].filePath

    const blob = await put(filePath, '', {
      access: 'public',
    });

    console.log(blob)
    
    return JSON.stringify({ images });
  } catch (e) {
    console.log(e)
    return JSON.stringify({})
  }
}
