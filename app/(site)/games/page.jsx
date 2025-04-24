// app/games/page.js
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'; // always server‑render

export const metadata = {
  title: 'الألعاب | Lava Gaming',
  description: 'استكشف مجموعتنا الواسعة من أحدث ألعاب الفيديو في مركز لافا للألعاب في بغداد. ألعاب متنوعة لجميع الأذواق والمنصات.',
  keywords: 'ألعاب فيديو، ألعاب كمبيوتر، PS5، Xbox، مركز ألعاب، لافا، بغداد، العاب شبية، ألعاب قتال، ألعاب رياضية، ألعاب استراتيجية',
  openGraph: {
    title: 'الألعاب | Lava Gaming',
    description: 'استكشف مجموعتنا الواسعة من أحدث ألعاب الفيديو في مركز لافا للألعاب',
    locale: 'ar_IQ',
    type: 'website',
    images: [
      {
        url: '/images/games-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'ألعاب متوفرة في مركز لافا',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الألعاب | Lava Gaming',
    description: 'استكشف مجموعتنا الواسعة من أحدث ألعاب الفيديو في مركز لافا للألعاب',
    images: ['/images/games-banner.jpg'],
  },
};

// Fetch games list from your API
async function getGames() {
  const host = (await headers()).get('host');
  if (!host) {
    console.warn('No host header, returning empty list');
    return [];
  }
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/games`, { cache: 'no-store' });
  if (!res.ok) {
    console.warn(`Games API returned ${res.status}`);
    return [];
  }
  return res.json();
}

function GameCard({ game }) {
  return (
    <Link href={`/games/${game.id}`} className="block h-full">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-red-700/30 hover:scale-105 transition-all duration-300 h-full flex flex-col">
        <div className="relative h-64 overflow-hidden bg-black">
          <Image
            src={game.imageUrl}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            className="hover:scale-110 transition-transform duration-500"
            priority={game.popular}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <span className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded backdrop-blur-sm">
            {game.category}
          </span>
          
          {game.popular && (
            <span className="absolute top-2 left-2 px-3 py-1 bg-red-600 text-white text-xs rounded-full shadow-lg">
              شائع
            </span>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
          <p className="text-gray-400 text-sm flex-grow line-clamp-3">{game.description}</p>
          <button className="mt-4 w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-center transition-colors">
            عرض التفاصيل
          </button>
        </div>
      </div>
    </Link>
  );
}

export default async function GamesPage() {
  const games = await getGames();

  return (
    <main
      dir="rtl"
      className="relative min-h-screen text-white"
      style={{
        background: 'linear-gradient(to bottom, #000000, #1a0000)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Gradient overlay */}
      <div className=" absolute inset-0 bg-black bg-gradient-to-l from-red-950 to-50% to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-center">الألعاب المتوفرة</h1>
        <p className="text-xl text-gray-300 mb-12 text-center">
          اكتشف مجموعتنا الواسعة من أحدث ألعاب الفيديو في مركز LAVA
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </main>
  );
}