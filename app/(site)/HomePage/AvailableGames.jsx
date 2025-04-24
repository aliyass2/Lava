// app/components/AvailableGames.jsx
import { headers } from 'next/headers'
import Link from 'next/link'
import InfiniteImageSlider from '../components/images-components/InfiniteImageSlider.jsx'

export const metadata = {
  title: 'الألعاب المتوفرة | منصة الألعاب الخاصة بك',
  description: 'تصفح مجموعتنا من الألعاب الشعبية والعصرية مع مجتمعات نشطة. اكتشف أفضل الألعاب للعب الآن.',
  openGraph: {
    title: 'الألعاب المتوفرة | منصة الألعاب الخاصة بك',
    description: 'اكتشف الألعاب الرائجة مع مجتمعات نشطة من اللاعبين',
    images: [
      { url: '/images/og-games.jpg', width: 1200, height: 630, alt: 'مجموعة الألعاب المتوفرة' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الألعاب المتوفرة | منصة الألعاب الخاصة بك',
    description: 'تصفح مجموعتنا من الألعاب الشعبية والعصرية',
    images: ['/images/og-games.jpg'],
  },
  alternates: {
    canonical: '/games',
    languages: { 'en-US': '/en/games', 'ar-SA': '/ar/games' },
  },
}

// always fetch fresh on every request
export const dynamic = 'force-dynamic'

export default async function AvailableGames() {
  // 1️⃣ Get host (e.g. "localhost:3000" or "my-app.vercel.app")
  const host = (await headers()).get('host')
  if (!host) throw new Error('Unable to determine host for API call')

  // 2️⃣ Build absolute URL
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const apiUrl   = `${protocol}://${host}/api/games`

  // 3️⃣ Fetch the real games list
  const res = await fetch(apiUrl, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch games, status: ${res.status}`)
  const data = await res.json()

  // 4️⃣ Map into slider’s expected props
   const games = data.map(item => ({
       id:          item.id,
       title:       item.title,
       // rename `url` → `imageUrl`
       imageUrl:    item.imageUrl,
       description: item.description,
       link:        `/games/${item.id}`
     }))

  return (
    <section 
      className="relative py-8 px-4 bg-black text-white" 
      aria-labelledby="available-games-heading"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-50% pointer-events-none" />
      <div className="relative container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 
            id="available-games-heading" 
            className="text-2xl font-bold text-right" 
            dir="rtl" 
            lang="ar"
          >
            الألعاب المتوفرة
          </h2>
          <Link 
            href="/all-games" 
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-300"
            aria-label="عرض جميع الألعاب المتوفرة"
          >
            رؤية الكل
          </Link>
        </div>
        
        <InfiniteImageSlider items={games} />
      </div>
    </section>
  )
}
