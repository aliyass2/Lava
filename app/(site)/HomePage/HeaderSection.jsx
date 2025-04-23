// app/components/HeaderSection.jsx
import { headers } from 'next/headers'
import ImageCarousel from '../components/images-components/ImageCarousel.jsx'

// ensure every request re‑fetches
export const dynamic = 'force-dynamic'

export default async function HeaderSection() {
  // grab host (e.g. "localhost:3000" or "my-app.vercel.app")
  const host = (await headers()).get('host')
  if (!host) {
    throw new Error('Unable to determine host for Gallery API call')
  }

  // choose protocol based on environment
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const apiUrl   = `${protocol}://${host}/api/Gallery`

  // fetch your internal API
  const res = await fetch(apiUrl, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to fetch gallery, status: ${res.status}`)
  }
  const data = await res.json()

  // map API data → ImageCarousel props
  const carouselImages = data.map(item => ({
    url:         item.image,
    title:       item.title,
    description: item.description,
  }))

  return (
    <header>
      <ImageCarousel images={carouselImages} />
    </header>
  )
}
