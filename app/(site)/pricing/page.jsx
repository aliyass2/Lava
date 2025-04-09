// app/pricing/page.js
import Link from 'next/link';

export default function Pricing() {
  // Pricing data - in a real app, you would fetch this from a database or API
  const pricingItems = [
    {
      id: 1,
      name: "PlayStation 4",
      hourlyRate: "5,000",
      currency: "دينار عراقي",
      features: [
        "شاشة عالية الجودة",
        "جهاز تحكم لاسلكي",
        "مجموعة متنوعة من الألعاب",
        "جلسة مريحة"
      ],
      image: "/api/placeholder/300/200",
      popular: true
    },
    {
      id: 2,
      name: "PlayStation 5",
      hourlyRate: "8,000",
      currency: "دينار عراقي",
      features: [
        "تجربة الجيل الجديد",
        "دقة 4K",
        "مكتبة ألعاب متطورة",
        "وحدة تحكم DualSense"
      ],
      image: "/api/placeholder/300/200",
      popular: false
    },
    {
      id: 3,
      name: "Xbox Series X",
      hourlyRate: "7,500",
      currency: "دينار عراقي",
      features: [
        "أداء عالي",
        "مكتبة ألعاب Xbox",
        "دعم التحديث التلقائي",
        "تجربة لعب سلسة"
      ],
      image: "/api/placeholder/300/200",
      popular: false
    },
    {
      id: 4,
      name: "PC Gaming",
      hourlyRate: "6,000",
      currency: "دينار عراقي",
      features: [
        "حاسوب متطور للألعاب",
        "دعم الألعاب متعددة اللاعبين",
        "إعدادات رسومية عالية",
        "لوحة مفاتيح وماوس احترافي"
      ],
      image: "/api/placeholder/300/200",
      popular: false
    },
    {
      id: 5,
      name: "VR Gaming",
      hourlyRate: "10,000",
      currency: "دينار عراقي",
      features: [
        "تجربة الواقع الافتراضي",
        "نظارات VR متطورة",
        "مساحة لعب واسعة",
        "ألعاب VR حصرية"
      ],
      image: "/api/placeholder/300/200",
      popular: false
    },
    {
      id: 6,
      name: "باقة العائلة",
      hourlyRate: "15,000",
      currency: "دينار عراقي",
      features: [
        "غرفة خاصة للعائلة",
        "تشمل 4 أجهزة متنوعة",
        "مشروبات مجانية",
        "خصم 20% على وجبات الطعام"
      ],
      image: "/api/placeholder/300/200",
      popular: false
    }
  ];

  // Special offers and packages
  const packages = [
    {
      id: 1,
      name: "باقة 5 ساعات",
      description: "احصل على خصم عند شراء باقة 5 ساعات للجهاز الذي تختاره",
      price: "22,500",
      currency: "دينار عراقي",
      discount: "تخفيض 10%",
      for: "PlayStation 4"
    },
    {
      id: 2,
      name: "باقة 10 ساعات",
      description: "باقة ممتازة لمحبي الألعاب - توفير كبير مع صلاحية لمدة شهر",
      price: "40,000",
      currency: "دينار عراقي",
      discount: "تخفيض 20%",
      for: "PlayStation 4"
    },
    {
      id: 3,
      name: "باقة البطولات",
      description: "خاص للفرق المشاركة في البطولات - تدريب وممارسة",
      price: "100,000",
      currency: "دينار عراقي",
      discount: "25 ساعة لكل فريق",
      for: "جميع الأجهزة"
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent text-white">
      {/* Header with Background */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
 
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">أسعارنا</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">أفضل الأسعار للاستمتاع بتجربة ألعاب لا مثيل لها</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        {/* Pricing Grid */}
        <h2 className="text-3xl font-bold mb-8 text-center">أسعار الساعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricingItems.map((item) => (
            <div 
              key={item.id} 
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-xl transform transition-transform hover:scale-105 relative ${
                item.popular ? 'border-2 border-red-500' : ''
              }`}
            >
              {item.popular && (
                <div className="absolute top-0 right-0 bg-red-500 text-white py-1 px-4 rounded-bl-lg font-bold">
                  الأكثر استخداماً
                </div>
              )}
              <div className="h-40 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{item.name}</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-red-500">{item.hourlyRate}</span>
                  <span className="text-gray-400 mr-2">/ {item.currency} للساعة</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                  احجز الآن
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Special Packages */}
        <h2 className="text-3xl font-bold mb-8 text-center">الباقات الخاصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl"
            >
              <div className="bg-red-600 text-white inline-block px-3 py-1 rounded-full text-sm font-bold mb-4">
                {pkg.discount}
              </div>
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-400 mb-4">{pkg.description}</p>
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>مخصصة لـ: {pkg.for}</span>
              </div>
              <div className="flex items-end my-6">
                <span className="text-3xl font-bold text-white">{pkg.price}</span>
                <span className="text-gray-400 mr-2">/ {pkg.currency}</span>
              </div>
              <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                اشترك في الباقة
              </button>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-gray-800 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">معلومات إضافية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
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
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium mb-2">طرق الدفع</h3>
                <p className="text-gray-400">نقبل الدفع النقدي والبطاقات الائتمانية والدفع الإلكتروني</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium mb-2">الحجز المسبق</h3>
                <p className="text-gray-400">يمكنك الحجز المسبق لضمان توفر الجهاز في الوقت المناسب لك</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
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