// app/(site)/games/[slug]/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 60; // ISR: revalidate this page every 60 seconds

// Helper: convert a YouTube URL into its embed form
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.has('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
  } catch (e) {
    console.warn('Invalid video URL:', url);
  }
  return url;
}

// Fetch a single game by ID (slug)
async function getGameBySlug(slug) {
  const host = headers().get('host');
  if (!host) return null;
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/games/${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

// Fetch all games and pick 3 others in the same category
async function getRelatedGames(category, currentId) {
  const host = headers().get('host');
  if (!host) return [];
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/games`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const all = await res.json();
  return all
    .filter(game => game.category === category && game.id !== currentId)
    .slice(0, 3);
}

export default async function GamePage({ params }) {
  const { slug } = params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const embedUrl = game.videoUrl ? toEmbedUrl(game.videoUrl) : null;
  const related = await getRelatedGames(game.category, game.id);

  return (
    <main dir="rtl" className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-transparent to-50% pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Game Image */}
          <div className="md:w-1/3 rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={game.image}
              alt={game.title}
              width={500}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Game Info */}
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full mr-3">
                {game.category}
              </span>
              {game.popular && (
                <span className="bg-yellow-500 text-black text-sm px-3 py-1 rounded-full">
                  شائع
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
            <p className="text-xl text-gray-300 mb-6">{game.description}</p>
            <div className="flex gap-4">

              <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                احجز جهازًا
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 bg-black bg-gradient-to-l from-red-950 to-transparent to-50%">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About & Video */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">عن اللعبة</h2>
              <p className="text-gray-300 mb-6">{game.longDescription}</p>
              {embedUrl && (
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    title={`${game.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Screenshots */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">لقطات من اللعبة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {game.screenshots.map((src, i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    <Image
                      src={src}
                      alt={`${game.title} screenshot ${i + 1}`}
                      width={400}
                      height={225}
                      className="object-cover w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {game.features.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">المميزات</h2>
                <ul className="space-y-2">
                  {game.features.map((feat, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-red-500 ml-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* System Specs */}
            {game.systemSpecs && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">متطلبات النظام</h2>
                <ul className="space-y-4">
                  {Object.entries(game.systemSpecs).map(([key, val]) => (
                    <li key={key}>
                      <span className="block text-red-500 font-medium mb-1">{key}:</span>
                      <span className="text-gray-300">{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Box */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">العب الآن</h2>
              <p className="text-gray-300 mb-4">
                استمتع بتجربة اللعب في مركزنا مع أفضل المعدات وأجواء رائعة.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  احجز جهازًا
                </button>
                <Link href="/pricing">
                
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer">
                  أسعار اللعب
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Games */}
      {related.length > 0 && (
        <section className="py-12 bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">ألعاب مشابهة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link href={`/games/${r.id}`} key={r.id}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform">
                    <div className="relative h-40">
                      <Image
                        src={r.imageUrl || r.image}
                        alt={r.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <span className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                        {r.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white">{r.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Games */}
      <section className="py-8 bg-black bg-gradient-to-l from-red-950 to-transparent to-50%">
        <div className="container mx-auto px-4 text-center">
          <Link href="/games">
            <span className="inline-block border border-red-700 text-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-6 rounded-full transition-colors">
              العودة إلى قائمة الألعاب
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
