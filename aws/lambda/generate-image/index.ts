import { Handler } from 'aws-lambda'
// import { generateAsync } from 'stability-client'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { Configuration, OpenAIApi } from 'openai'
import axios from 'axios'

type Input = {
  prompt: string
}

export const handler: Handler = async (req) => {
  const { prompt } = JSON.parse(req.body) as Input

  try {
    // @ts-ignore
    // const { images } = await generateAsync({
    //   prompt,
    //   apiKey: process.env.DREAM_STUDIO_APIKEY!,
    //   noStore: true,
    //   steps: 50,
    // })

    try {
      // const arrayBuffer = images[0].buffer as ArrayBuffer
      const apiKey = process.env.OPENAI_APIKEY
      const configuration = new Configuration({
        apiKey,
      })
      const openai = new OpenAIApi(configuration)
      const response = await openai.createImage({
        prompt,
        n: 1,
        size: '512x512',
      })
      const imageUrl = response.data.data[0].url!

      const res = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      })
      const arrayBuffer = new Uint8Array(res.data).buffer

      const blob = await put(uuidv4(), arrayBuffer, {
        access: 'public',
      })

      console.log('generate: ' + blob.url)
      return JSON.stringify({ url: blob.url })
    } catch (error) {
      console.log(error)
      return JSON.stringify({})
    }
  } catch (e) {
    console.log(e)
    return JSON.stringify({})
  }
}
