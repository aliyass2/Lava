// app/pricing/page.js
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;             // ISR: revalidate every 60s
export const dynamic    = 'force-dynamic';// always server-render

// Fetch all pricing items
async function fetchPrices() {
  const host = headers().get('host');
  if (!host) return null;
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/prices`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

// Fetch all VIP packages
async function fetchVips() {
  const host = headers().get('host');
  if (!host) return null;
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/vips`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function PricingPage() {
  const pricingItems = await fetchPrices();
  const packages     = await fetchVips();

  if (!pricingItems || !packages) {
    notFound();
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-black text-white bg-gradient-to-l from-red-950 to-50% to-transparent"
    >
      {/* Header */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">أسعارنا</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            أفضل الأسعار للاستمتاع بتجربة ألعاب لا مثيل لها
          </p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        {/* Hourly Rates */}
        <h2 className="text-3xl font-bold mb-8 text-center">أسعار الساعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricingItems.map((item) => (
            <div
              key={item.id}
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-xl transform transition-transform hover:scale-105 relative ${
                item.mostused ? 'border-2 border-red-500' : ''
              }`}
            >
              {item.mostused && (
                <div className="absolute top-0 right-0 bg-red-500 text-white py-1 px-4 rounded-bl-lg font-bold">
                  الأكثر استخداماً
                </div>
              )}
              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{item.productName}</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-red-500">
                    {item.finalPrice}
                  </span>
                  <span className="text-gray-400 mr-2">
                    / دينار عراقي للساعة
                  </span>
                </div>
                <ul className="mb-6 space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 
                             8a1 1 0 01-1.414 0l-4-4a1 1 
                             0 011.414-1.414L8 
                             12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          ))}
        </div>

        {/* VIP Packages */}
        <h2 className="text-3xl font-bold mb-8 text-center">الباقات الخاصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl"
            >
              <div className="bg-red-600 text-white inline-block px-3 py-1 rounded-full text-sm font-bold mb-4">
                {pkg.discount
                  ? `تخفيض ${pkg.discount}%`
                  : 'بدون خصم'}
              </div>
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-400 mb-4">{pkg.description}</p>
              <div className="flex items-end my-6">
                <span className="text-3xl font-bold text-white">
                  {pkg.finalPrice}
                </span>
                <span className="text-gray-400 mr-2">/ دينار عراقي</span>
              </div>

            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">معلومات إضافية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                  {/* Clock icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium mb-2">ساعات العمل</h3>
                <p className="text-gray-400">كل يوم من الساعة 10 صباحاً حتى 12 منتصف الليل</p>
              </div>
            </div>
            {/* …other info blocks… */}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">استمتع بأفضل تجربة ألعاب اليوم</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            نوفر لك أحدث الأجهزة وأفضل الألعاب بأسعار مناسبة. زورنا اليوم واستمتع بتجربة لا تُنسى!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <span className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                تواصل معنا
              </span>
            </Link>
            <Link href="/tournaments">
              <span className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors">
                البطولات القادمة
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
