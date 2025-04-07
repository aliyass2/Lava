// app/games/[slug]/page.js

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Function to fetch a specific game by slug
async function getGameBySlug(slug) {
  // In a real application, you'd fetch from your API or database
  const games = [
    {
      id: 1,
      title: "League of Legends",
      category: "MOBA",
      imageUrl: "/temp/League.jpg",
      description: "تنافس في معارك جماعية 5v5 في واحدة من أشهر ألعاب MOBA في العالم.",
      longDescription:
        "League of Legends هي لعبة استراتيجية جماعية حيث يتنافس فريقان مكونان من خمسة لاعبين...",
      features: [
        "أكثر من 140 بطلاً للاختيار من بينهم",
        "أوضاع لعب متنوعة",
        "تحديثات منتظمة للمحتوى",
        "نظام تنافسي عالمي المستوى",
      ],
      requirements: {
        processor: "معالج 2 GHz",
        ram: "4 GB RAM",
        graphics: "بطاقة رسومات متوافقة مع DirectX 9.0c",
        storage: "16 GB مساحة خالية",
      },
      screenshots: ["/temp/League.jpg", "/temp/League.jpg", "/temp/League.jpg"],
      videoUrl: "https://www.youtube.com/embed/vzHrjOMfHPY",
      slug: "league-of-legends",
      popular: true,
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      category: "RPG",
      imageUrl: "/temp/Cyberpunk.jpg",
      description:
        "انغمس في عالم مستقبلي مفتوح مليء بالتكنولوجيا المتطورة والمغامرات.",
      longDescription:
        "Cyberpunk 2077 هي لعبة تقمص أدوار في عالم مفتوح تدور أحداثها في مدينة نايت سيتي...",
      features: [
        "عالم مفتوح استثنائي للاستكشاف",
        "تخصيص الشخصية بالكامل",
        "قصة متفرعة مع نهايات متعددة",
        "أنظمة قتال متنوعة",
      ],
      requirements: {
        processor: "معالج Intel Core i5-3570K أو AMD FX-8310",
        ram: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 970 أو AMD Radeon RX 470",
        storage: "70 GB مساحة خالية",
      },
      screenshots: [
        "/temp/Cyberpunk.jpg",
        "/temp/Cyberpunk.jpg",
        "/temp/Cyberpunk.jpg",
      ],
      videoUrl: "https://www.youtube.com/embed/qIcTM8WXFjk",
      slug: "cyberpunk-2077",
      popular: true,
    },
    {
      id: 3,
      title: "Call of Duty",
      category: "FPS",
      imageUrl: "/temp/CallofDutyBlackOps6.webp",
      description: "خض معارك حماسية في أحدث إصدارات سلسلة ألعاب إطلاق النار الشهيرة.",
      longDescription:
        "Call of Duty هي واحدة من أشهر سلاسل ألعاب إطلاق النار من منظور الشخص الأول...",
      features: [
        "حملة قصصية مثيرة",
        "وضع متعدد اللاعبين مع خرائط متنوعة",
        "وضع Zombies الشهير",
        "تحديثات موسمية منتظمة",
      ],
      requirements: {
        processor: "معالج Intel Core i5-2500K أو AMD Ryzen R5 1600X",
        ram: "12 GB RAM",
        graphics: "NVIDIA GeForce GTX 970 أو AMD Radeon RX 580",
        storage: "175 GB مساحة خالية",
      },
      screenshots: [
        "/temp/CallofDutyBlackOps6.webp",
        "/temp/CallofDutyBlackOps6.webp",
        "/temp/CallofDutyBlackOps6.webp",
      ],
      videoUrl: "https://www.youtube.com/embed/JOmg3dgJj2Y",
      slug: "call-of-duty",
      popular: true,
    },
    {
      id: 4,
      title: "For Honor",
      category: "Action",
      imageUrl: "/temp/forhonor.jpg",
      description: "قاتل كمحارب من العصور الوسطى في معارك ملحمية ضد لاعبين آخرين.",
      longDescription:
        "For Honor هي لعبة قتال تضعك في دور محارب من ثلاث فصائل تاريخية...",
      features: [
        "نظام قتال Art of Battle الفريد",
        "اختر من بين 12 فئة من المحاربين",
        "حملة قصصية مشوقة",
        "أوضاع متعددة للعب الجماعي",
      ],
      requirements: {
        processor: "معالج Intel Core i3-550 أو AMD Phenom II X4 955",
        ram: "6 GB RAM",
        graphics: "NVIDIA GeForce GTX 660 أو AMD Radeon HD 7870",
        storage: "40 GB مساحة خالية",
      },
      screenshots: [
        "/temp/forhonor.jpg",
        "/temp/forhonor.jpg",
        "/temp/forhonor.jpg",
      ],
      videoUrl: "https://www.youtube.com/embed/sp3NKQlJPuo",
      slug: "for-honor",
      popular: false,
    },
    {
      id: 5,
      title: "FIFA 25",
      category: "Sports",
      imageUrl: "/temp/fifa.jpg",
      description:
        "استمتع بأكثر لعبة كرة قدم واقعية مع أحدث الفرق واللاعبين.",
      longDescription:
        "FIFA 25 هي أحدث إصدار من سلسلة ألعاب كرة القدم الشهيرة. استمتع بتجربة كرة قدم واقعية...",
      features: [
        "أكثر من 17,000 لاعب حقيقي",
        "أكثر من 700 نادي في 30 دوري",
        "وضع FIFA Ultimate Team",
        "تقنيات حركة واقعية للغاية",
      ],
      requirements: {
        processor: "معالج Intel Core i5-6600k أو AMD Ryzen 5 1600",
        ram: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 1050 Ti أو AMD Radeon RX 570",
        storage: "50 GB مساحة خالية",
      },
      screenshots: ["/temp/fifa.jpg", "/temp/fifa.jpg", "/temp/fifa.jpg"],
      videoUrl: "https://www.youtube.com/embed/G_hMhE2OSUY",
      slug: "fifa-25",
      popular: true,
    },
  ];

  const game = games.find((g) => g.slug === slug);
  return game;
}

// Function to get related games
async function getRelatedGames(category, currentSlug) {
  // In a real application, you'd fetch this from your API
  const allGames = [
    {
      id: 1,
      title: "League of Legends",
      category: "MOBA",
      imageUrl: "/temp/League.jpg",
      slug: "league-of-legends",
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      category: "RPG",
      imageUrl: "/temp/Cyberpunk.jpg",
      slug: "cyberpunk-2077",
    },
    {
      id: 3,
      title: "Call of Duty",
      category: "FPS",
      imageUrl: "/temp/CallofDutyBlackOps6.webp",
      slug: "call-of-duty",
    },
    {
      id: 4,
      title: "For Honor",
      category: "Action",
      imageUrl: "/temp/forhonor.jpg",
      slug: "for-honor",
    },
    {
      id: 5,
      title: "FIFA 25",
      category: "Sports",
      imageUrl: "/temp/fifa.jpg",
      slug: "fifa-25",
    },
  ];

  // Find games with the same category but not the current game
  return allGames
    .filter((game) => game.category === category && game.slug !== currentSlug)
    .slice(0, 3);
}

export default async function GamePage({ params }) {
  const { slug } = params;
  const game = await getGameBySlug(slug);

  // If game not found, show 404 page
  if (!game) {
    notFound();
  }

  // Get related games
  const relatedGames = await getRelatedGames(game.category, game.slug);

  return (
    <main dir="rtl" className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* The requested gradient overlay from right to left, up to 50% */}
        <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-transparent to-50% pointer-events-none" />

        {/* Hero content above the gradient */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Game Image */}
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  width={500}
                  height={500}
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* Game Details */}
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
              <div className="flex flex-wrap gap-4">
                <button className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  ابدأ اللعب الآن
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  احجز جهازًا
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Details Tabs */}
      <section className="py-12 inset-0 bg-gradient-to-l from-red-950 to-transparent to-50% ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Game */}
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">عن اللعبة</h2>
                <p className="text-gray-300 mb-6">{game.longDescription}</p>

                {game.videoUrl && (
                  <div
                    className="relative pb-9 h-0 overflow-hidden"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={game.videoUrl}
                      title={`${game.title} trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* Screenshots */}
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">لقطات من اللعبة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <Image
                        src={screenshot}
                        alt={`${game.title} screenshot ${index + 1}`}
                        width={400}
                        height={225}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">المميزات</h2>
                <ul className="space-y-2">
                  {game.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-red-500 ml-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* System Requirements */}
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">متطلبات النظام</h2>
                <ul className="space-y-4">
                  <li>
                    <span className="block text-red-500 font-medium mb-1">
                      المعالج:
                    </span>
                    <span className="text-gray-300">
                      {game.requirements.processor}
                    </span>
                  </li>
                  <li>
                    <span className="block text-red-500 font-medium mb-1">
                      الذاكرة:
                    </span>
                    <span className="text-gray-300">
                      {game.requirements.ram}
                    </span>
                  </li>
                  <li>
                    <span className="block text-red-500 font-medium mb-1">
                      بطاقة الرسومات:
                    </span>
                    <span className="text-gray-300">
                      {game.requirements.graphics}
                    </span>
                  </li>
                  <li>
                    <span className="block text-red-500 font-medium mb-1">
                      مساحة التخزين:
                    </span>
                    <span className="text-gray-300">
                      {game.requirements.storage}
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA Box */}
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">العب الآن</h2>
                <p className="text-gray-300 mb-4">
                  استمتع بتجربة اللعب في مركزنا مع أفضل المعدات وأجواء رائعة.
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    احجز جهازًا
                  </button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    أسعار اللعب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="py-12 bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">ألعاب مشابهة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedGames.map((relatedGame) => (
                <Link href={`/games/${relatedGame.slug}`} key={relatedGame.id}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                    <div className="h-40 relative">
                      <Image
                        src={relatedGame.imageUrl}
                        alt={relatedGame.title}
                        width={500}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                          {relatedGame.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white">
                        {relatedGame.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Games */}
      <section className="py-8 bg-black inset-0 bg-gradient-to-l from-red-950 to-transparent to-50% ">
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
