// app/tournaments/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'; // always fetch fresh
export const metadata = {
  title: 'البطولات | Lava Gaming',
  description: 'تعرف على أحدث البطولات القادمة والجارية في مركز لافا للألعاب في بغداد. شارك في منافسات الألعاب الإلكترونية واربح جوائز قيمة.',
  keywords: 'بطولات العاب, مسابقات, لافا للألعاب, العاب الكترونية, بطولات قادمة, بغداد, مسابقات الألعاب',
  openGraph: {
    title: 'البطولات | Lava Gaming',
    description: 'تعرف على أحدث البطولات القادمة والجارية في مركز لافا للألعاب',
    locale: 'ar_IQ',
    type: 'website',
    images: [
      {
        url: '/images/tournaments-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'بطولات مركز لافا للألعاب',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'البطولات | Lava Gaming',
    description: 'تعرف على أحدث البطولات القادمة والجارية في مركز لافا للألعاب',
    images: ['/images/tournaments-banner.jpg'],
  },
};

async function getTournaments() {
  const host = headers().get('host');
  if (!host) return [];
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/tournaments`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  return res.json();
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'JARIYA':    return 'bg-green-600 text-white';
    case 'QADIMA':    return 'bg-blue-600 text-white';
    case 'MUNTAHYA':  return 'bg-gray-600 text-white';
    default:          return 'bg-gray-600 text-white';
  }
}

function getStatusArabic(status) {
  switch (status) {
    case 'JARIYA':    return 'جارية';
    case 'QADIMA':    return 'قادمة';
    case 'MUNTAHYA':  return 'منتهية';
    default:          return '';
  }
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">البطولات</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map(t => {
            const startDate = new Date(t.startDate).toLocaleDateString('ar-EG', {
              day: 'numeric', month: 'long', year: 'numeric'
            });
            const badgeClass = getStatusBadgeClass(t.status);
            const statusArabic = getStatusArabic(t.status);

            return (
              <div key={t.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform">
                {/* Image + status badge */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10" />
                  <span className={`absolute top-4 left-4 ${badgeClass} px-3 py-1 rounded-full text-sm font-bold z-20`}>
                    {statusArabic}
                  </span>
                  <Image
                    src={t.image}
                    alt={t.title}
                    fill
                    className="object-cover z-0"
                  />
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col">
                  <Link
                    href={`/tournaments/${t.id}`}
                    className="text-2xl font-bold mb-2 hover:text-red-500 transition-colors"
                  >
                    {t.title}
                  </Link>
                  <div className="text-gray-300 mb-1">تاريخ البدء: {startDate}</div>
                  <div className="text-gray-300 mb-4">الجائزة: {t.prize}</div>
                  <Link href={`/tournaments/${t.id}`}>
                    <span className="mt-auto inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-center transition-colors">
                      التفاصيل
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
