// app/components/GameCenterNews.jsx
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

// Force dynamic rendering (we’ll handle caching manually)
export const dynamic = 'force-dynamic'

// UI categories
const categories = [
  { id: 'all',           name: 'جميع الأخبار' },
  { id: 'tournaments',   name: 'البطولات'   },
  { id: 'promotions',    name: 'العروض'     },
  { id: 'facilities',    name: 'الطعام'     },
  { id: 'announcements', name: 'الإعلانات'  },
]

// Map Arabic API category → our internal IDs
const categoryMap = {
  'البطولات':   'tournaments',
  'العروض':     'promotions',
  'الطعام':     'facilities',
  'الإعلانات':  'announcements',
}

// Raw sample (API-shaped) fallback data
const sampleRawNews = [
  {
    id: 1,
    slug: 'new-menu',
    title: 'قائمة طعام ومشروبات جديدة متاحة',
    description: 'تحقق من قائمة الطعام الجديدة المستوحاة من الألعاب مع مشروبات الطاقة والوجبات الخفيفة لتعزيز جلسات اللعب.',
    category: 'الطعام',
    date: '2025-03-30T00:00:00.000Z',
    image: '/temp/League.jpg',
    content: '',
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 2,
    slug: 'extended-hours',
    title: 'ساعات عمل إضافية خلال عطلة الربيع',
    description: 'نقوم بتمديد ساعات العمل لدينا حتى الساعة 2 صباحًا خلال أسبوع عطلة الربيع. المزيد من الوقت للألعاب!',
    category: 'الإعلانات',
    date: '2025-04-02T00:00:00.000Z',
    image: '/temp/Cyberpunk.jpg',
    content: '',
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 3,
    slug: 'lol-tournament',
    title: 'بطولة نهاية الأسبوع: League of Legends',
    description: 'انضم إلى بطولة 5 ضد 5 هذا الأسبوع مع جوائز بقيمة 500 دولار. سجل فريقك اليوم!',
    category: 'البطولات',
    date: '2025-04-03T00:00:00.000Z',
    image: '/temp/League.jpg',
    content: '',
    createdAt: '',
    updatedAt: ''
  }
]

// Fetch raw news from our internal API (no-store so we control caching), fallback if needed
async function getGameCenterNews() {
  const host = headers().get('host')
  if (!host) {
    console.warn('Unable to determine host; using sample data')
    return sampleRawNews
  }

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const apiUrl   = `${protocol}://${host}/api/news`

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' })
    if (!res.ok) {
      console.warn(`News API returned ${res.status}; using sample data`)
      return sampleRawNews
    }
    return res.json()
  } catch (err) {
    console.error('Failed to fetch news:', err)
    return sampleRawNews
  }
}

// Normalize API shape → UI shape
function normalize(item) {
  const catId = categoryMap[item.category] || 'all'
  const dt = new Date(item.date)
  const formattedDate = dt.toLocaleDateString('ar-EG', {
    day:   'numeric',
    month: 'long',
    year:  'numeric'
  })
  return {
    id:       item.id,
    title:    item.title,
    excerpt:  item.excerpt ?? item.description,
    image:    item.image,
    category: catId,
    date:     formattedDate,
    url:      `/news/${item.slug ?? item.id}`
  }
}

export default async function GameCenterNews({ initialCategory = 'all' }) {
  const rawNews   = await getGameCenterNews()
  const newsItems = rawNews.map(normalize)
  const filtered  = initialCategory === 'all'
    ? newsItems
    : newsItems.filter(n => n.category === initialCategory)

  return (
    <section 
      className="relative py-8 px-4 bg-black text-white" 
      aria-labelledby="news-heading"
      dir="rtl"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent pointer-events-none" />

      <div className="relative container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="news-heading" className="text-2xl font-bold text-right" lang="ar">
            أخبار المركز
          </h2>
          {/* Updated Link: no extra <a> */}
          <Link
            href="/news"
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-300"
            aria-label="عرض جميع الأخبار"
          >
            رؤية الكل
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.slice(0, 3).map(news => (
            <div 
              key={news.id} 
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div className="relative h-40">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                  {categories.find(c => c.id === news.category)?.name}
                </span>
                <span className="absolute top-2 right-2 px-2 py-1 bg-gray-900 bg-opacity-60 text-white text-xs rounded">
                  {news.date}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {news.excerpt}
                </p>
                {/* Updated Link: no extra <a> */}
                <Link
                  href={news.url}
                  className="inline-block bg-yellow-500 text-black text-sm font-bold py-1 px-3 rounded hover:bg-yellow-400 transition-colors"
                >
                  قراءة المزيد
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
