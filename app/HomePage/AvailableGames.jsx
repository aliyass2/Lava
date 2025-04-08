// app/components/AvailableGames.jsx
import Link from 'next/link';
import InfiniteImageSlider from './../components/images-components/InfiniteImageSlider.jsx';
export const metadata = {
  title: 'الألعاب المتوفرة | منصة الألعاب الخاصة بك',
  description: 'تصفح مجموعتنا من الألعاب الشعبية والعصرية مع مجتمعات نشطة. اكتشف أفضل الألعاب للعب الآن.',
  openGraph: {
    title: 'الألعاب المتوفرة | منصة الألعاب الخاصة بك',
    description: 'اكتشف الألعاب الرائجة مع مجتمعات نشطة من اللاعبين',
    images: [
      {
        url: '/images/og-games.jpg',
        width: 1200,
        height: 630,
        alt: 'مجموعة الألعاب المتوفرة',
      },
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
    languages: {
      'en-US': '/en/games',
      'ar-SA': '/ar/games',
    },
  },
};

// Simulated API call to fetch game data
async function getGames() {
  return [
    {
      id: 1,
      title: "For Honor",
      imageUrl: "/temp/forhonor.jpg",
      slug: "for-honor"
    },
    {
      id: 2,
      title: "League of Legends",
      imageUrl: "/temp/League.jpg",
      slug: "league-of-legends"
    },
    {
      id: 3,
      title: "Call of Duty",
      imageUrl: "/temp/CallofDutyBlackOps6.webp",
      slug: "call-of-duty"
    },
    {
      id: 4,
      title: "Cyberpunk 2077",
      imageUrl: "/temp/Cyberpunk.jpg",
      slug: "cyberpunk-2077"
    },
    // Add more games as needed
  ];
}

export default async function AvailableGames() {
  const games = await getGames();

  return (
    <section 
      className="relative py-8 px-4 bg-black text-white" 
      aria-labelledby="available-games-heading"
      dir='rtl'
    >
      {/* Red linear gradient overlay from right to left */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-50% pointer-events-none"></div>
      <div className="relative container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 
            id="available-games-heading" 
            className="text-2xl font-bold text-right" 
            dir="rtl" 
            lang="ar"
          >
            الالعاب المتوفرة
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
  );
}
