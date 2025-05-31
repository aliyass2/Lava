// app/contact/page.js
import { FaFacebookSquare, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa';
import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { memo } from 'react';

// Social icons can be memoized as they don't change
const FacebookIcon = memo(() => <FaFacebookSquare className="w-10 h-10" />);
const InstagramIcon = memo(() => <FaInstagram className="w-10 h-10" />);
const TikTokIcon = memo(() => <FaTiktok className="w-10 h-10" />);
const MapIcon = memo(() => <FaMapMarkerAlt className="h-6 w-6" />);
const PhoneIcon = memo(() => <FaPhoneAlt className="h-6 w-6" />);
const ClockIcon = memo(() => <FaClock className="h-6 w-6" />);

// Assign names for React DevTools
FacebookIcon.displayName = 'FacebookIcon';
InstagramIcon.displayName = 'InstagramIcon';
TikTokIcon.displayName = 'TikTokIcon';
MapIcon.displayName = 'MapIcon';
PhoneIcon.displayName = 'PhoneIcon';
ClockIcon.displayName = 'ClockIcon';

export const metadata = {
  title: 'تواصل معنا  | Lava Gaming',
  description: 'تواصل مع مركز ألعاب لافا في بغداد. زورنا في موقعنا أو اتصل بنا أو تابعنا على وسائل التواصل الاجتماعي. نستقبلكم يومياً من الساعة 10 صباحاً حتى 12 منتصف الليل.',
  keywords: 'اتصل, تواصل, لافا, العاب, بغداد, العراق, شبكات تواصل, مركز ألعاب, عنوان, رقم هاتف, ساعات العمل, فيسبوك, انستغرام, تيك توك',
  openGraph: {
    title: 'تواصل معنا | Lava Gaming',
    description: 'تواصل مع مركز ألعاب لافا في بغداد. العنوان: شارع الجمهورية، مركز التسوق الكبير، الطابق الثالث',
    locale: 'ar_IQ',
    type: 'website',
    url: 'https://lavagaming.iq/contact',
    siteName: 'Lava Gaming',
    images: [
      {
        url: '/images/contact-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'تواصل مع مركز لافا للألعاب في بغداد',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تواصل معنا | مركز لافا للألعاب بغداد',
    description: 'تواصل مع مركز ألعاب لافا في بغداد. زورنا أو اتصل بنا على +964 771 234 5678',
    images: ['/images/contact-banner.jpg'],
    site: '@LavaGamingIQ',
  },
  alternates: {
    canonical: 'https://lavagaming.iq/contact',
    languages: {
      'ar-IQ': 'https://lavagaming.iq/contact',
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

// Define structured data outside component to avoid recreation on each render
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "مركز لافا للألعاب",
  "image": "https://lavagaming.iq/images/logo.png",
  "url": "https://lavagaming.iq",
  "telephone": "+964 771 234 5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "شارع الجمهورية، مركز التسوق الكبير، الطابق الثالث",
    "addressLocality": "بغداد",
    "addressRegion": "بغداد",
    "addressCountry": "العراق"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "33.3974771",
    "longitude": "44.4033205"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    "opens": "10:00",
    "closes": "00:00"
  },
  "sameAs": [
    "https://facebook.com/LavaGamingIQ",
    "https://instagram.com/LavaGaming",
    "https://tiktok.com/@LavaGamingIQ"
  ]
};

// Precomputed JSON string to avoid stringify on each render
const STRUCTURED_DATA_JSON = JSON.stringify(STRUCTURED_DATA);

export default function Contact() {
  // Location and contact information
  const contactInfo = [
    {
      icon: <MapIcon />,
      title: "العنوان",
      content: "البنوك-شارع الفتلاوي-بناية قشطوطة-الطابق الثالث"
    },
    {
      icon: <PhoneIcon />,
      title: "رقم الهاتف",
      content: "+964 773 407 7356"
    },
    {
      icon: <ClockIcon />,
      title: "ساعات العمل",
      content: "كل يوم من 10 صباحاً حتى 12 منتصف الليل"
    }
  ];
  
  // Social media platforms
  const socialMedia = [
    {
      name: "Facebook",
      username: "LAVA Gaming center",
      description: "تابعنا على فيسبوك للبقاء على اطلاع بأحدث البطولات والعروض الخاصة.",
      icon: <FacebookIcon />,
      color: "bg-blue-600",
      link: "https://www.facebook.com/profile.php?id=61573865646740 "
    },
    {
      name: "Instagram",
      username: "lava.gc",
      description: "شاهد صور وفيديوهات من أحدث الفعاليات والبطولات في مركزنا.",
      icon: <InstagramIcon />,
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      link: "https://www.instagram.com/lava.gc/"
    },
    {
      name: "TikTok",
      username: "lava.gc",
      description: "شاهد أفضل اللحظات ومقاطع من بطولاتنا ومسابقاتنا.",
      icon: <TikTokIcon />,
      color: "bg-gradient-to-br from-black via-gray-900 to-gray-800 hover:from-rose-500 hover:via-fuchsia-500 hover:to-cyan-500",
      link: "https://www.tiktok.com/@lava.gc"
    }
  ];

  return (
    <>
      <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
        {STRUCTURED_DATA_JSON}
      </Script>
      <div dir="rtl" className="min-h-screen bg-black text-white inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent">
        {/* Header with Background */}
        <div className="relative h-64 flex items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">تواصل معنا</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">تواصل معنا وتابعنا على وسائل التواصل الاجتماعي</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-12 px-4">
          {/* Contact Information */}
          <section aria-labelledby="contact-info-title">
            <h2 id="contact-info-title" className="text-3xl font-bold mb-8 text-center">معلومات الاتصال</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-xl text-center" dir='ltr'>
                  <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2" >{info.title}</h3>
                  <p className="text-gray-400">
                    {info.title === "رقم الهاتف" ? (
                      <a href={`tel:${info.content.replace(/\s+/g, '')}`} className="hover:text-red-400 transition-colors">
                        {info.content}
                      </a>
                    ) : (
                      info.content
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Map (Placeholder) */}
          {/* Embedded Google Map */}
          <section aria-labelledby="map-title" className="mt-16 mb-16">
            <h2 id="map-title" className="text-3xl font-bold mb-8 text-center">موقعنا على الخريطة</h2>
            <div className="max-w-4xl mx-auto h-64 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps?q=33.3974771,44.4033205&z=16&output=embed"
                className="w-full h-full border-0"
                title="موقع مركز لافا للألعاب على الخريطة"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </section>
          
          {/* Social Media Cards */}
          <section aria-labelledby="social-media-title">
            <h2 id="social-media-title" className="text-3xl font-bold mb-8 text-center">تابعنا على وسائل التواصل الاجتماعي</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {socialMedia.map((platform, index) => (
                <a 
                  key={index} 
                  href={platform.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group"
                  aria-label={`تابعنا على ${platform.name}`}
                >
                  <div className={`${platform.color} rounded-xl p-6 h-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}>
                    <div className="flex justify-between items-center mb-4">
                      {platform.icon}
                      <span className="text-lg font-bold">{platform.name}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:underline">{platform.username}</h3>
                    <p className="text-sm opacity-90">{platform.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Contact Form CTA */}
          <section aria-labelledby="contact-cta" className="mt-16 text-center">
            <h2 id="contact-cta" className="text-3xl font-bold mb-4">هل لديك أي استفسار؟</h2>
            <p className="text-xl mb-6">نحن دائماً هنا للإجابة على أسئلتك ومساعدتك</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                استعرض الأسعار
              </Link>
              <Link href="/" className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors">
                العودة للرئيسية
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}