// app/tournaments/page.js
import Link from 'next/link';

// This is a Server Component - No "use client" directive needed
export default function Tournaments() {
  // Static data - in a real app, you would fetch this from a database or API
  const tournaments = [
    { 
      id: 1, 
      name: "بطولة الصيف", 
      slug: "summer-championship", 
      date: "١٥ يونيو ٢٠٢٥", 
      participants: 32,
      game: "Fortnite",
      prize: "١٠,٠٠٠ ريال",
      status: "upcoming",
      image: "/temp/Cyberpunk.jpg"
    },
    { 
      id: 2, 
      name: "بطولة الشتاء", 
      slug: "winter-invitational", 
      date: "١٠ ديسمبر ٢٠٢٥", 
      participants: 16,
      game: "PUBG",
      prize: "٥,٠٠٠ ريال",
      status: "upcoming",
      image: "/temp/Cyberpunk.jpg"
    },
    { 
      id: 3, 
      name: "بطولة الربيع المفتوحة", 
      slug: "spring-open", 
      date: "٢٢ أبريل ٢٠٢٥", 
      participants: 64,
      game: "League of Legends",
      prize: "١٥,٠٠٠ ريال",
      status: "active",
      image: "/temp/fifa.jpg"
    },
    { 
      id: 4, 
      name: "كلاسيك الخريف", 
      slug: "fall-classic", 
      date: "٣٠ سبتمبر ٢٠٢٥", 
      participants: 24,
      game: "FIFA 25",
      prize: "٧,٥٠٠ ريال",
      status: "completed",
      image: "temp/fifa.jpg"
    },
    { 
      id: 5, 
      name: "تحدي المحترفين", 
      slug: "pro-challenge", 
      date: "٥ مايو ٢٠٢٥", 
      participants: 32,
      game: "Counter-Strike 2",
      prize: "١٢,٠٠٠ ريال",
      status: "active",
      image: "/temp/fifa.jpg"
    },
    { 
      id: 6, 
      name: "بطولة الرمضانية", 
      slug: "ramadan-cup", 
      date: "١٥ مارس ٢٠٢٥", 
      participants: 48,
      game: "Valorant",
      prize: "٢٠,٠٠٠ ريال",
      status: "upcoming",
      image: "/temp/fifa.jpg"
    }
  ];
  // Function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'active': return 'bg-green-600 text-white';
      case 'upcoming': return 'bg-blue-600 text-white';
      case 'completed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Function to translate status to Arabic
  const getStatusInArabic = (status) => {
    switch(status) {
      case 'active': return 'جارية';
      case 'upcoming': return 'قادمة';
      case 'completed': return 'منتهية';
      default: return '';
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent">
      {/* Header with Background - Updated gradient */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className=""></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">البطولات</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">انضم إلى أفضل اللاعبين وشارك في بطولاتنا المثيرة للفوز بجوائز قيمة</p>
        </div>
      </div>

      {/* Tournaments Grid - Filter tabs have been removed */}
      <div className="container mx-auto py-8 px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
                <div className={`absolute top-4 left-4 ${getStatusBadgeClass(tournament.status)} px-3 py-1 rounded-full text-sm font-bold z-20`}>
                  {getStatusInArabic(tournament.status)}
                </div>
                <img 
                  className="w-full h-full object-cover" 
                  src="/api/placeholder/500/300"  // Replace with actual image in production
                  alt={tournament.name} 
                />
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="bg-black bg-opacity-70 rounded-lg px-3 py-1">
                    <p className="text-sm font-medium">{tournament.game}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <Link href={`/tournaments/${tournament.slug}`}>
                  <h2 className="text-2xl font-bold hover:text-red-500 transition-colors mb-2">{tournament.name}</h2>
                </Link>
                
                <div className="flex flex-wrap gap-4 my-4">
                  <div className="flex items-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{tournament.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{tournament.participants} مشارك</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="text-red-500 font-bold">
                    الجائزة: {tournament.prize}
                  </div>
                  
                  <Link href={`/tournaments/${tournament.slug}`}>
                    <span className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                      التفاصيل
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// If you need to filter tournaments based on URL parameters
export async function generateMetadata({ searchParams }) {
  const status = searchParams.status || 'all';
  
  let title = 'البطولات | Lava Gaming Center';
  if (status === 'active') {
    title = 'البطولات الجارية | Lava Gaming Center';
  } else if (status === 'upcoming') {
    title = 'البطولات القادمة | Lava Gaming Center';
  } else if (status === 'completed') {
    title = 'البطولات المنتهية | Lava Gaming Center';
  }
  
  return {
    title,
    description: 'بطولات مركز لافا للألعاب - انضم إلى بطولاتنا المثيرة واربح جوائز قيمة'
  };
}