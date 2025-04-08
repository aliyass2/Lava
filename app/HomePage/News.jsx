import Image from 'next/image';
import Link from 'next/link';

// Function to fetch news from API
async function getGameCenterNews() {
  // Replace with your actual API endpoint
  try {
    const res = await fetch('https://your-api-endpoint/news', { 
      next: { revalidate: 3600 } // Revalidate cache every hour
    });
    
    if (!res.ok) {
      // Fallback to sample data if API fails
      return sampleNewsData;
    }
    
    return res.json();
  } catch (error) {
    console.error('Failed to fetch news:', error);
    // Return sample data as fallback
    return sampleNewsData;
  }
}

// Sample data as fallback
const sampleNewsData = [
  {
    id: 1,
    title: "قائمة طعام ومشروبات جديدة متاحة",
    excerpt: "تحقق من قائمة الطعام الجديدة المستوحاة من الألعاب مع مشروبات الطاقة والوجبات الخفيفة لتعزيز جلسات اللعب.",
    image: "/temp/League.jpg",
    category: "facilities",
    date: "30 مارس 2025",
    url: "/news/new-menu"
  },
  {
    id: 2,
    title: "ساعات عمل إضافية خلال عطلة الربيع",
    excerpt: "نقوم بتمديد ساعات العمل لدينا حتى الساعة 2 صباحًا خلال أسبوع عطلة الربيع. المزيد من الوقت للألعاب!",
    image: "/temp/Cyberpunk.jpg",
    category: "announcements",
    date: "2 أبريل 2025",
    url: "/news/extended-hours"
  },
  {
    id: 3,
    title: "بطولة نهاية الأسبوع: League of Legends",
    excerpt: "انضم إلى بطولة 5 ضد 5 هذا الأسبوع مع جوائز بقيمة 500 دولار. سجل فريقك اليوم!",
    image: "/temp/League.jpg",
    category: "tournaments",
    date: "3 أبريل 2025",
    url: "/news/lol-tournament"
  }
];

// News categories
const categories = [
  { id: 'all', name: 'جميع الأخبار' },
  { id: 'tournaments', name: 'البطولات' },
  { id: 'promotions', name: 'العروض' },
  { id: 'facilities', name: 'الطعام' },
  { id: 'announcements', name: 'الإعلانات' }
];

export default async function GameCenterNews({ initialCategory = 'all' }) {
  // Fetch news data
  const newsItems = await getGameCenterNews();
  
  // Filter news based on active category
  const filteredNews = initialCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === initialCategory);

  return (
    <section 
      className="relative py-8 px-4 bg-black text-white" 
      aria-labelledby="news-heading"
      dir='rtl'
    >
      {/* Red linear gradient overlay from right to left */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-50% pointer-events-none"></div>
      
      <div className="relative container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 
            id="news-heading" 
            className="text-2xl font-bold text-right" 
            dir="rtl" 
            lang="ar"
          >
            أخبار المركز
          </h2>
          <Link 
            href="/news" 
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-300"
            aria-label="عرض جميع الأخبار"
          >
            رؤية الكل
          </Link>
        </div>
        
        {/* News Grid - 3 cards in one row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
          {filteredNews.slice(0, 3).map(news => (
            <div key={news.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-40 relative">
                <Image 
                  src={news.image} 
                  alt={news.title}
                  width={500}
                  height={300}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                    {categories.find(cat => cat.id === news.category)?.name}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-gray-900 bg-opacity-60 text-white text-xs rounded">
                    {news.date}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{news.excerpt}</p>
                <Link href={news.url}>
                  <span className="inline-block bg-yellow-500 text-black text-sm font-bold py-1 px-3 rounded hover:bg-yellow-400 transition-colors cursor-pointer">
                    قراءة المزيد
                  </span>
                </Link>
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </section>
  );
}