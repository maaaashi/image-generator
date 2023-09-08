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
      noStore: true,
      steps: 50,
    })

    try {
      const arrayBuffer = images[0].buffer as ArrayBuffer

      await put(prompt, arrayBuffer, {
        access: 'public',
      })
    } catch (error) {
      console.log(error)
    }

    return JSON.stringify({ images })
  } catch (e) {
    console.log(e)
    return JSON.stringify({})
  }
}
