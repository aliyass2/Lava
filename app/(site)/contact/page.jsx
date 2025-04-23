// app/contact/page.js
"use client";
import { FaFacebookSquare, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa';

export default function Contact() {
  // Location and contact information
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="h-6 w-6" />,
      title: "العنوان",
      content: "شارع الجمهورية، مركز التسوق الكبير، الطابق الثالث، بغداد، العراق"
    },
    {
      icon: <FaPhoneAlt className="h-6 w-6" />,
      title: "رقم الهاتف",
      content: "+964 771 234 5678"
    },
    {
      icon: <FaClock className="h-6 w-6" />,
      title: "ساعات العمل",
      content: "كل يوم من 10 صباحاً حتى 12 منتصف الليل"
    }
  ];
  
  // Social media platforms
  const socialMedia = [
    {
      name: "Facebook",
      username: "@LavaGamingIQ",
      description: "تابعنا على فيسبوك للبقاء على اطلاع بأحدث البطولات والعروض الخاصة.",
      icon: <FaFacebookSquare className="w-10 h-10" />,
      color: "bg-blue-600",
      link: "https://facebook.com/"
    },
    {
      name: "Instagram",
      username: "@LavaGaming",
      description: "شاهد صور وفيديوهات من أحدث الفعاليات والبطولات في مركزنا.",
      icon: <FaInstagram className="w-10 h-10" />,
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      link: "https://instagram.com/"
    },
    {
      name: "TikTok",
      username: "@LavaGamingIQ",
      description: "شاهد أفضل اللحظات ومقاطع من بطولاتنا ومسابقاتنا.",
      icon: <FaTiktok className="w-10 h-10" />,
      color: "bg-gray-800",
      link: "https://tiktok.com/"
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent">
      {/* Header with Background */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden">

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">اتصل بنا</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">تواصل معنا وتابعنا على وسائل التواصل الاجتماعي</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        {/* Contact Information */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">معلومات الاتصال</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                <p className="text-gray-400">{info.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Map (Placeholder) */}
       {/* Embedded Google Map */}
       <div className="max-w-4xl mx-auto mb-16 h-64 rounded-lg overflow-hidden shadow-lg">
  <iframe
    src="https://www.google.com/maps?q=33.3974771,44.4033205&z=21&output=embed"
    className="w-full h-full border-0"
    allowFullScreen
    loading="lazy"
  />
</div>
        
        {/* Social Media Cards */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">تابعنا على وسائل التواصل الاجتماعي</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialMedia.map((platform, index) => (
              <a 
                key={index} 
                href={platform.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
              >
                <div className={`${platform.color} rounded-xl p-6 h-full transition-transform transform hover:scale-105 hover:shadow-lg`}>
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
        </div>
      </div>
    </div>
  );
}