// app/news/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'; // always fetch fresh

export const metadata = {
  title: 'الأخبار | Lava Gaming',
  description: 'تابع أحدث أخبار وفعاليات مركز لافا للألعاب في بغداد. اطلع على آخر التطورات، والمسابقات، والعروض الخاصة، ومعلومات الأحداث القادمة.',
  keywords: 'أخبار الألعاب، أخبار لافا، مركز ألعاب، فعاليات، مسابقات، عروض خاصة، بغداد، أخبار، أحداث',
  openGraph: {
    title: 'الأخبار | Lava Gaming',
    description: 'تابع أحدث أخبار وفعاليات مركز لافا للألعاب في بغداد',
    locale: 'ar_IQ',
    type: 'website',
    images: [
      {
        url: '/images/news-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'أخبار مركز لافا للألعاب',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الأخبار | Lava Gaming',
    description: 'تابع أحدث أخبار وفعاليات مركز لافا للألعاب في بغداد',
    images: ['/images/news-banner.jpg'],
  },
};

async function getNewsArticles() {
  const host = headers().get('host');
  if (!host) return [];
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${protocol}://${host}/api/news`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden" dir="rtl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent pointer-events-none" />

      <main className="relative container mx-auto px-4 py-8">
        {/* News Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">أخبار المركز</h2>
        </div>

        {/* Featured News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => {
            const formattedDate = new Date(article.date).toLocaleDateString('ar-EG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });

            return (
              <div
                key={article.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-md">
                    {article.category}
                  </div>
                  <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                    {formattedDate}
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {article.description}
                  </p>

                  <Link
                    href={`/news/${article.slug}`}
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md text-sm font-medium"
                  >
                    قراءة المزيد
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
