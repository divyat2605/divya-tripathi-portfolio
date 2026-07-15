import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export const alt = 'Divya Tripathi | Software Engineer Portfolio'

export const size = {
  width: 768,
  height: 1376,
}

export const contentType = 'image/png'

export default async function Image() {
  const filePath = path.join(process.cwd(), 'public', 'assets', 'speaker.png')
  const buffer = await readFile(filePath)

  return new Response(buffer, {
    headers: {
      'content-type': 'image/png',
    },
  })
}