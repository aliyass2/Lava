// app/games/page.js
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'; // always server‑render

export const metadata = {
  title: 'الألعاب | Lava Gaming',
  description: 'استكشف مجموعتنا الواسعة من أحدث ألعاب الفيديو في مركز لافا للألعاب في بغداد. ألعاب متنوعة لجميع الأذواق والمنصات.',
  keywords: 'ألعاب فيديو، ألعاب كمبيوتر، PS5، Xbox، مركز ألعاب، لافا، بغداد، العاب شعبية، ألعاب قتال، ألعاب رياضية، ألعاب استراتيجية',
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
    <Link href={`/games/${game.id}`}>
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform h-full flex flex-col">
        <div className="relative h-48">
          <Image
            src={game.imageUrl}
            alt={game.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <span className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
            {game.category}
          </span>
          {game.popular && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
              شائع
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
          <p className="text-gray-400 text-sm flex-grow">{game.description}</p>
          <span className="mt-4 inline-block bg-red-700 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded text-center transition-colors">
            عرض التفاصيل
          </span>
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
        background: 'black',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-transparent to-50% pointer-events-none" />

      <div className="relative container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-center">الألعاب المتوفرة</h1>
        <p className="text-xl text-gray-300 mb-12 text-center">
          اكتشف مجموعتنا الواسعة من أحدث ألعاب الفيديو في مركز LAVA
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </main>
  );
}
