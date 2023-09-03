import { NextRequest, NextResponse } from 'next/server'
import { generateAsync } from 'stability-client'

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json()

  try {
    const result = await generateAsync({
      prompt,
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      outDir: 'public/generated',
    })

    console.log(result)

    // @ts-ignore
    const images = result.images

    return NextResponse.json({ images })
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
