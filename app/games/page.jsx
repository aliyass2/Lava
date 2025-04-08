// app/games/page.js (Server Component)

import Image from 'next/image';
import Link from 'next/link';
import GamingExperience from './components/GamingExperience.jsx';

// Function to fetch games from API
async function getGames() {
  // In a real implementation, this would fetch from your API or database
  // Mock data - replace with actual API call
  return [
    {
      id: 1,
      title: 'League of Legends',
      category: 'MOBA',
      imageUrl: '/temp/League.jpg',
      description:
        'تنافس في معارك جماعية 5v5 في واحدة من أشهر ألعاب MOBA في العالم.',
      slug: 'league-of-legends',
      popular: true,
    },
    {
      id: 2,
      title: 'Cyberpunk 2077',
      category: 'RPG',
      imageUrl: '/temp/Cyberpunk.jpg',
      description:
        'انغمس في عالم مستقبلي مفتوح مليء بالتكنولوجيا المتطورة والمغامرات.',
      slug: 'cyberpunk-2077',
      popular: true,
    },
    {
      id: 3,
      title: 'Call of Duty',
      category: 'FPS',
      imageUrl: '/temp/CallofDutyBlackOps6.webp',
      description:
        'خض معارك حماسية في أحدث إصدارات سلسلة ألعاب إطلاق النار الشهيرة.',
      slug: 'call-of-duty',
      popular: true,
    },
    {
      id: 4,
      title: 'For Honor',
      category: 'Action',
      imageUrl: '/temp/forhonor.jpg',
      description: 'قاتل كمحارب من العصور الوسطى في معارك ملحمية ضد لاعبين آخرين.',
      slug: 'for-honor',
      popular: false,
    },
    {
      id: 5,
      title: 'FIFA 25',
      category: 'Sports',
      imageUrl: '/temp/fifa.jpg',
      description:
        'استمتع بأكثر لعبة كرة قدم واقعية مع أحدث الفرق واللاعبين.',
      slug: 'fifa-25',
      popular: true,
    },
  ];
}

// Game card component
function GameCard({ game }) {
  return (
    <Link href={`/games/${game.slug}`}>
      <div className="bg-gray-900 to-50% rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 h-full flex flex-col">
        {/* Game Image */}
        <div className="relative h-48">
          <Image
            src={game.imageUrl}
            alt={game.title}
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
          {/* Category Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
              {game.category}
            </span>
          </div>
          {/* Popular Badge */}
          {game.popular && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                شائع
              </span>
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
          <p className="text-gray-400 text-sm mb-4 flex-grow">
            {game.description}
          </p>
          <div className="mt-auto pt-2">
            <span className="inline-block bg-red-700 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded transition-colors w-full text-center">
              عرض التفاصيل
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function Games() {
  // Fetch all games
  const games = await getGames();

  return (
    <main
      dir="rtl"
      className="relative min-h-screen text-white"
      style={{
        background: 'black',          // base color
        backgroundSize: 'cover',      // optional
        backgroundPosition: 'center', // optional
        backgroundAttachment: 'fixed' // optional
      }}
    >
      {/* Red gradient overlay from right to left */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-transparent to-50% " />

      {/* Main content container */}
      <div className="relative">

        {/* Hero Section */}
        <section
          className="py-16 text-white"
          // We remove the old inline gradient style since we have the new overlay
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">استكشف عالم الألعاب</h1>
              <p className="text-xl text-gray-300 mb-8">
                اكتشف مجموعتنا الواسعة من أحدث وأفضل ألعاب الفيديو المتاحة في مركز LAVA للألعاب
              </p>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-12 bg-black  inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent ">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              الألعاب المتوفرة
            </h2>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>

        {/* Gaming Experience Section */}
        <GamingExperience />
      </div>
    </main>
  );
}
