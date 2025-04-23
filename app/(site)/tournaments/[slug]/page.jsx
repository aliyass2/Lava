// app/tournaments/[slug]/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 60;          // ISR: revalidate every 60s
export const dynamic = 'force-dynamic'; // always server-render

// Fetch a single tournament by ID
async function fetchTournament(id) {
  const host = (await headers()).get('host');
  if (!host) return null;
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/tournaments/${id}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

// Map API status → Arabic + badge classes
function getStatusInfo(status) {
  switch (status) {
    case 'JARIYA':   return { text: 'جارية',    class: 'bg-green-600' };
    case 'QADIMA':   return { text: 'قادمة',    class: 'bg-blue-600'  };
    case 'MUNTAHYA': return { text: 'منتهية',  class: 'bg-gray-600'  };
    default:         return { text: status,     class: 'bg-gray-600'  };
  }
}

export default async function TournamentPage(props) {
  const params = await props.params;
  const { slug } = params; // slug is the tournament ID
  const t = await fetchTournament(slug);
  if (!t) notFound();

  // parse rules: array of JSON strings
  let specs = [];
  try {
    specs = t.rules.map(r => JSON.parse(r));
  } catch {
    specs = [];
  }

  // format dates
  const start = new Date(t.startDate).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const end   = t.endDate
    ? new Date(t.endDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const status = getStatusInfo(t.status);

  return (
    <main dir="rtl" className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="" />

      {/* Hero */}
      <section className="relative h-80">
        <Image
          src={t.image}
          alt={t.title}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4">
          <span className={`${status.class} text-white px-3 py-1 rounded-full mb-4`}>
            {status.text}
          </span>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <div className="text-gray-300">
            {start}{end && ` – ${end}`} | {t.prize}
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="container mx-auto px-4 mt-6">
        <Link
          href="/tournaments"
          className="inline-block text-blue-400 hover:text-blue-500 mb-4"
        >
          &larr; العودة إلى قائمة البطولات
        </Link>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-3">وصف البطولة</h2>
            <p className="text-gray-300 leading-relaxed">{t.description}</p>
          </div>

          {/* Times */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-3">مواعيد البطولة</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>بداية: {t.startTime || start}</li>
              {end && <li>نهاية: {t.endTime || end}</li>}
            </ul>
          </div>

          {/* System Specs / Rules */}
          {specs.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">متطلبات/قواعد</h2>
              {specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 mb-4">
                  {Object.entries(spec).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400">{key}:</span>
                      <span className="font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Prizes */}
          {Array.isArray(t.prizes) && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">توزيع الجوائز</h2>
              <ul className="space-y-2">
                {t.prizes.map((p, i) => (
                  <li key={i} className="flex justify-between text-gray-300">
                    <span>{p.position}</span>
                    <span className="font-medium">{p.award}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Registration */}
          <div className="bg-gray-900 rounded-lg p-6 sticky top-8">
            <h2 className="text-2xl font-bold mb-4">التسجيل</h2>
            <div className="mb-4">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>المسجلون</span>
                <span>{t.administrators.length} مشارك</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${(t.administrators.length / t.participants) * 100}%`
                  }}
                />
              </div>
            </div>
            <button
              disabled={t.status !== 'QADIMA'}
              className={`w-full py-2 rounded-md font-bold transition ${
                t.status === 'QADIMA'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {t.status === 'QADIMA' ? 'التسجيل الآن' : 'التسجيل مغلق'}
            </button>
          </div>

          {/* Administrators */}
          {Array.isArray(t.administrators) && t.administrators.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">المنظمون</h2>
              <ul className="space-y-2 text-gray-300">
                {t.administrators.map((admin, i) => (
                  <li key={i}>{admin}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
