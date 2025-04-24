// app/pricing/page.js
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';

export const dynamic = 'force-dynamic'; // always server-render

export const metadata = {
  title: 'الاسعار | باقات مميزة وأسعار تنافسية | Lava Gaming',
  description: 'استمتع بأفضل تجربة ألعاب مع باقات وأسعار مناسبة في مركز لافا للألعاب. نوفر لك أحدث الأجهزة وأفضل الألعاب بأسعار تنافسية للساعة أو باقات خاصة للمجموعات.',
  keywords: 'اسعار, الباقات, لافا للألعاب, مركز العاب, بغداد, باقات خاصة, VIP, اسعار الساعة, العاب الكمبيوتر, PS5, Xbox, PC gaming, باقات الالعاب, ألعاب جماعية, خصومات',
  openGraph: {
    title: 'الاسعار | باقات مميزة وأسعار تنافسية | Lava Gaming',
    description: 'استمتع بأفضل تجربة ألعاب مع باقات وأسعار مناسبة في مركز لافا للألعاب بغداد. أسعار ساعية وباقات خاصة للمجموعات',
    locale: 'ar_IQ',
    type: 'website',
    url: 'https://lavagaming.iq/pricing',
    siteName: 'Lava Gaming',
    images: [
      {
        url: '/images/pricing-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'أسعار وباقات مركز لافا للألعاب بغداد',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الاسعار | باقات مميزة وأسعار تنافسية | Lava Gaming',
    description: 'استمتع بأفضل تجربة ألعاب مع باقات وأسعار مناسبة في مركز لافا للألعاب',
    images: ['/images/pricing-banner.jpg'],
    site: '@LavaGamingIQ',
  },
  alternates: {
    canonical: 'https://lavagaming.iq/pricing',
    languages: {
      'ar-IQ': 'https://lavagaming.iq/pricing',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Fetch all pricing items
async function fetchPrices() {
  const host = (await headers()).get('host');
  if (!host) return null;
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/prices`,
    { cache: 'no-store' }
  );
  if (!res.ok) return null;
  return res.json();
}

// Fetch all VIP packages
async function fetchVips() {
  const host = (await headers()).get('host');
  if (!host) return null;
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(
    `${proto}://${host}/api/vips`,
    { cache: 'no-store' }
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      ...pricingItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": item.productName,
          "description": item.features.join(', '),
          "offers": {
            "@type": "Offer",
            "price": item.finalPrice,
            "priceCurrency": "IQD",
            "availability": "https://schema.org/InStock"
          }
        }
      })),
      ...packages.map((pkg, index) => ({
        "@type": "ListItem",
        "position": index + pricingItems.length + 1,
        "item": {
          "@type": "Product",
          "name": pkg.name,
          "description": pkg.description,
          "offers": {
            "@type": "Offer",
            "price": pkg.finalPrice,
            "priceCurrency": "IQD",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    ]
  };

  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <div
        dir="rtl"
        className="min-h-screen bg-black text-white bg-gradient-to-l from-red-950 to-50% to-transparent"
      >
        {/* Header */}
        <div className="relative h-64 flex items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">الاسعار والباقات</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              أفضل الأسعار للاستمتاع بتجربة ألعاب لا مثيل لها في بغداد
            </p>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          {/* Hourly Rates */}
          <section aria-labelledby="hourly-rates-title" itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content="أسعار الساعة في مركز لافا للألعاب" />
            <h2 id="hourly-rates-title" className="text-3xl font-bold mb-8 text-center">أسعار الساعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {pricingItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-gray-800 rounded-xl overflow-hidden shadow-xl transform transition-transform hover:scale-105 relative ${
                    item.mostused ? 'border-2 border-red-500' : ''
                  }`}
                  itemScope 
                  itemType="https://schema.org/Product"
                  itemProp="itemListElement"
                >
                  <meta itemProp="position" content={index + 1} />
                  {item.mostused && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white py-1 px-4 rounded-bl-lg font-bold">
                      الأكثر استخداماً
                    </div>
                  )}
                  <div className="h-40 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={`سعر الساعة - ${item.productName} في مركز لافا للألعاب`}
                      width={400}
                      height={160}
                      className="w-full h-full object-cover"
                      priority={item.mostused}
                      loading={item.mostused ? "eager" : "lazy"}
                      itemProp="image"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4" itemProp="name">{item.productName}</h3>
                    <div className="flex items-end mb-6" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <meta itemProp="priceCurrency" content="IQD" />
                      <span className="text-4xl font-bold text-red-500" itemProp="price">
                        {item.finalPrice}
                      </span>
                      <span className="text-gray-400 mr-2">
                        / دينار عراقي للساعة
                      </span>
                    </div>
                    <ul className="mb-6 space-y-2" itemProp="description">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
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
          </section>

          {/* VIP Packages */}
          <section aria-labelledby="vip-packages-title" itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content="الباقات الخاصة في مركز لافا للألعاب" />
            <h2 id="vip-packages-title" className="text-3xl font-bold mb-8 text-center">الباقات الخاصة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl"
                  itemScope 
                  itemType="https://schema.org/Product"
                  itemProp="itemListElement"
                >
                  <meta itemProp="position" content={index + 1} />
                  <div className="bg-red-600 text-white inline-block px-3 py-1 rounded-full text-sm font-bold mb-4">
                    {pkg.discount
                      ? `تخفيض ${pkg.discount}%`
                      : 'بدون خصم'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2" itemProp="name">{pkg.name}</h3>
                  <p className="text-gray-400 mb-4" itemProp="description">{pkg.description}</p>
                  <div className="flex items-end my-6" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="priceCurrency" content="IQD" />
                    <span className="text-3xl font-bold text-white" itemProp="price">
                      {pkg.finalPrice}
                    </span>
                    <span className="text-gray-400 mr-2">/ دينار عراقي</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Info */}
          <section aria-labelledby="additional-info-title" className="bg-gray-800 rounded-xl p-8 mb-16">
            <h2 id="additional-info-title" className="text-2xl font-bold mb-6">معلومات إضافية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                    {/* Clock icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
          </section>

          {/* Final CTA */}
          <section aria-labelledby="cta-title" className="text-center">
            <h2 id="cta-title" className="text-3xl font-bold mb-6">استمتع بأفضل تجربة ألعاب اليوم</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              نوفر لك أحدث الأجهزة وأفضل الألعاب بأسعار مناسبة. زورنا اليوم واستمتع بتجربة لا تُنسى!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                تواصل معنا
              </Link>
              <Link href="/tournaments" className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors">
                البطولات القادمة
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}