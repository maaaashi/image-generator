import { NextRequest, NextResponse } from 'next/server'
import { generateAsync } from 'stability-client'
import { Configuration, OpenAIApi } from 'openai'

const postGPT = async (prompt: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GPT_API_KEY
  const configuration = new Configuration({
    apiKey,
  })
  const openai = new OpenAIApi(configuration)
  const model = 'gpt-4'

  const content = `画像生成AIを使って、「${prompt}」を書くための英語のプロンプトを考えてください。`
  //   const content = `
  // [Rules].
  // Create a prompt that instructs the AI to generate an illustration.
  // Create a keyword list using only adjectives, verbs and nouns for the sentences you are about to enter.
  // The keywords should be in English.
  // The number of keywords should be at least 10 and no more than 30.
  // No other information is required.

  // [Format]
  // keyword, keyword, keyword, (loop below)
  // `

  return await openai.createChatCompletion({
    model,
    temperature: 2,
    messages: [
      {
        role: 'system',
        content,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })
}

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json()

  try {
    const response = await postGPT(prompt)
    const con = response.data.choices[0].message?.content!

    console.log(prompt + ' is ' + response.data.choices[0].message?.content!)
    // @ts-ignore
    const { images } = await generateAsync({
      prompt: con,
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      outDir: 'public/',
      noStore: true,
    })

    return NextResponse.json({ images })
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
