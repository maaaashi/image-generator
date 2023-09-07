import { Handler } from 'aws-lambda'
import { generateAsync } from 'stability-client'

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
      outDir: 'public/',
      noStore: true,
      steps: 50,
    })

    return JSON.stringify({ images });
  } catch (e) {
    return JSON.stringify({})
  }
}