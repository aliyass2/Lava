// app/tournaments/[slug]/page.js
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data - in a real app, you would fetch this from a database or API
const tournamentsData = [
  { 
    id: 1, 
    name: "بطولة الصيف", 
    slug: "summer-championship", 
    date: "١٥ يونيو ٢٠٢٥", 
    participants: 32,
    registeredCount: 18,
    maxParticipants: 32,
    registrationDeadline: "١٠ يونيو ٢٠٢٥",
    startTime: "٢:٠٠ مساءً",
    game: "Fortnite",
    gameMode: "Solo",
    prize: "١٠,٠٠٠ ريال",
    prizeDistribution: [
      { position: "المركز الأول", amount: "٥,٠٠٠ ريال" },
      { position: "المركز الثاني", amount: "٣,٠٠٠ ريال" },
      { position: "المركز الثالث", amount: "١,٥٠٠ ريال" },
      { position: "المركز الرابع", amount: "٥٠٠ ريال" }
    ],
    status: "upcoming",
    location: "قاعة الألعاب الرئيسية - مركز لافا للألعاب",
    description: "بطولة الصيف السنوية تجمع أفضل اللاعبين لعطلة نهاية أسبوع من المنافسة المكثفة. سيتم اختبار مهاراتك في بناء المباني والتصويب، وستتاح لك الفرصة للفوز بجوائز نقدية كبيرة.",
    rules: [
      "يجب أن يكون عمر المشاركين ١٦ عامًا أو أكثر",
      "يجب على جميع اللاعبين الوصول قبل ٣٠ دقيقة من وقت البدء",
      "يُسمح للاعبين باستخدام وحدات التحكم الخاصة بهم",
      "سيتم استبعاد أي لاعب يظهر سلوكًا غير رياضي",
      "قرارات الحكام نهائية وملزمة"
    ],
    schedule: [
      { time: "٢:٠٠ مساءً", event: "تسجيل اللاعبين" },
      { time: "٣:٠٠ مساءً", event: "بداية الجولة الأولى" },
      { time: "٥:٠٠ مساءً", event: "استراحة" },
      { time: "٥:٣٠ مساءً", event: "بداية الجولة الثانية" },
      { time: "٧:٣٠ مساءً", event: "المباريات النهائية" },
      { time: "٩:٠٠ مساءً", event: "توزيع الجوائز" }
    ],
    image: "/temp/fifa.jpg",
    organizers: [
      { name: "أحمد محمد", role: "منظم رئيسي", contact: "ahmed@example.com" },
      { name: "سارة أحمد", role: "منسق البطولة", contact: "sara@example.com" }
    ]
  },
  { 
    id: 2, 
    name: "بطولة الشتاء", 
    slug: "winter-invitational", 
    date: "١٠ ديسمبر ٢٠٢٥", 
    participants: 16,
    registeredCount: 12,
    maxParticipants: 16,
    registrationDeadline: "٥ ديسمبر ٢٠٢٥",
    startTime: "٤:٠٠ مساءً",
    game: "PUBG",
    gameMode: "Squads (4 players)",
    prize: "٥,٠٠٠ ريال",
    prizeDistribution: [
      { position: "المركز الأول", amount: "٢,٥٠٠ ريال" },
      { position: "المركز الثاني", amount: "١,٥٠٠ ريال" },
      { position: "المركز الثالث", amount: "١,٠٠٠ ريال" }
    ],
    status: "upcoming",
    location: "قاعة المناسبات - مركز لافا للألعاب",
    description: "بطولة حصرية للفرق المدعوة فقط تضم أفضل ١٦ فريقًا مصنفًا. المشاركة بدعوة فقط للاعبين المتميزين في مجتمعنا.",
    rules: [
      "الفرق من ٤ لاعبين",
      "يجب أن يكون جميع أعضاء الفريق حاضرين للتسجيل",
      "يُسمح بالبدائل الاحتياطيين (لاعبين إضافيين) بحد أقصى لاعبين",
      "ممنوع استخدام البرامج المساعدة غير المصرح بها",
      "قرارات الحكام نهائية وملزمة"
    ],
    schedule: [
      { time: "٤:٠٠ مساءً", event: "الترحيب وتسجيل الفرق" },
      { time: "٥:٠٠ مساءً", event: "بداية المباريات التمهيدية" },
      { time: "٧:٠٠ مساءً", event: "استراحة وعشاء" },
      { time: "٨:٠٠ مساءً", event: "المباريات النهائية" },
      { time: "١٠:٠٠ مساءً", event: "توزيع الجوائز وختام البطولة" }
    ],
    image: "/temp/Cyberpunk.jpg",
    organizers: [
      { name: "محمد علي", role: "منظم رئيسي", contact: "mohammed@example.com" },
      { name: "فاطمة حسن", role: "منسق البطولة", contact: "fatima@example.com" }
    ]
  },
  { 
    id: 3, 
    name: "بطولة الربيع المفتوحة", 
    slug: "spring-open", 
    date: "٢٢ أبريل ٢٠٢٥", 
    participants: 64,
    registeredCount: 64,
    maxParticipants: 64,
    registrationDeadline: "تم إغلاق التسجيل",
    startTime: "١٠:٠٠ صباحًا",
    game: "League of Legends",
    gameMode: "5v5 Tournament Draft",
    prize: "١٥,٠٠٠ ريال",
    prizeDistribution: [
      { position: "المركز الأول", amount: "٧,٠٠٠ ريال" },
      { position: "المركز الثاني", amount: "٤,٠٠٠ ريال" },
      { position: "المركز الثالث", amount: "٢,٠٠٠ ريال" },
      { position: "المركز الرابع", amount: "١,٠٠٠ ريال" },
      { position: "المراكز ٥-٨", amount: "٢٥٠ ريال لكل فريق" }
    ],
    status: "active",
    location: "المجمع الرياضي - مركز لافا للألعاب",
    description: "أكبر بطولة لدينا على مدار العام، مفتوحة لجميع مستويات المهارة مع جولات تأهيلية تمهيدية. تمتد البطولة على مدار يومين كاملين مع بث مباشر لجميع المباريات.",
    rules: [
      "الفرق من ٥ لاعبين أساسيين + لاعبين احتياطيين كحد أقصى",
      "يجب أن يكون جميع اللاعبين من مستوى ٣٠ أو أعلى في اللعبة",
      "التحقق من الهوية مطلوب عند التسجيل",
      "سيتم نشر جدول المباريات قبل يوم واحد من البطولة",
      "تطبق قواعد البطولة الرسمية من Riot Games",
      "يجب على الفرق الالتزام بمواعيد المباريات بدقة"
    ],
    schedule: [
      { time: "اليوم الأول - ١٠:٠٠ صباحًا", event: "افتتاح البطولة" },
      { time: "اليوم الأول - ١١:٠٠ صباحًا", event: "الجولات التمهيدية" },
      { time: "اليوم الأول - ٧:٠٠ مساءً", event: "اختتام اليوم الأول" },
      { time: "اليوم الثاني - ١٠:٠٠ صباحًا", event: "مباريات ربع النهائي" },
      { time: "اليوم الثاني - ٢:٠٠ مساءً", event: "مباريات نصف النهائي" },
      { time: "اليوم الثاني - ٦:٠٠ مساءً", event: "المباراة النهائية وتوزيع الجوائز" }
    ],
    image: "/tournaments/lol-tournament.jpg",
    liveStreamLink: "https://twitch.tv/lavagaming",
    organizers: [
      { name: "خالد عبدالله", role: "منظم رئيسي", contact: "khaled@example.com" },
      { name: "نورة سعد", role: "منسق البطولة", contact: "noura@example.com" }
    ]
  },
  { 
    id: 4, 
    name: "كلاسيك الخريف", 
    slug: "fall-classic", 
    date: "٣٠ سبتمبر ٢٠٢٥", 
    participants: 24,
    registeredCount: 24,
    maxParticipants: 24,
    registrationDeadline: "تم إغلاق التسجيل",
    startTime: "٣:٠٠ مساءً",
    game: "FIFA 25",
    gameMode: "1v1 Singles",
    prize: "٧,٥٠٠ ريال",
    prizeDistribution: [
      { position: "المركز الأول", amount: "٣,٥٠٠ ريال" },
      { position: "المركز الثاني", amount: "٢,٠٠٠ ريال" },
      { position: "المركز الثالث", amount: "١,٠٠٠ ريال" },
      { position: "المركز الرابع", amount: "٥٠٠ ريال" },
      { position: "المراكز ٥-٨", amount: "١٢٥ ريال لكل لاعب" }
    ],
    status: "completed",
    location: "قاعة المباريات - مركز لافا للألعاب",
    description: "بطولة تقليدية للاحتفال بنهاية الموسم العادي مع أحداث ومراسم خاصة.",
    rules: [
      "جميع اللاعبين يجب أن يكونوا ١٤ عامًا أو أكثر",
      "يجب إحضار بطاقة الهوية للتحقق",
      "يُسمح باستخدام وحدات التحكم الشخصية",
      "مدة المباراة: شوطين مدة كل منهما ٦ دقائق",
      "في حالة التعادل، تُلعب أشواط إضافية ثم ركلات ترجيح"
    ],
    schedule: [
      { time: "٣:٠٠ مساءً", event: "التسجيل والقرعة" },
      { time: "٤:٠٠ مساءً", event: "بداية الجولة الأولى" },
      { time: "٦:٣٠ مساءً", event: "استراحة" },
      { time: "٧:٠٠ مساءً", event: "مباريات ربع ونصف النهائي" },
      { time: "٩:٠٠ مساءً", event: "المباراة النهائية" },
      { time: "٩:٣٠ مساءً", event: "حفل توزيع الجوائز" }
    ],
    image: "/tournaments/fifa-tournament.jpg",
    results: [
      { position: "المركز الأول", player: "محمد القحطاني" },
      { position: "المركز الثاني", player: "فيصل العتيبي" },
      { position: "المركز الثالث", player: "عبدالله الشمري" }
    ],
    organizers: [
      { name: "سلطان العنزي", role: "منظم رئيسي", contact: "sultan@example.com" },
      { name: "لينا الحربي", role: "منسق البطولة", contact: "lina@example.com" }
    ]
  }
];

// Server Component - Doesn't need "use client"
export default function TournamentDetails({ params }) {
  const { slug } = params;
  
  // Find the tournament with the matching slug
  const tournament = tournamentsData.find(t => t.slug === slug);
  
  // If tournament not found, return a 404
  if (!tournament) {
    notFound();
  }

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

  // Registration status and button text based on tournament status
  const getRegistrationStatus = () => {
    if (tournament.status === 'completed') {
      return {
        text: 'البطولة منتهية',
        buttonClass: 'bg-gray-600 cursor-not-allowed',
        disabled: true
      };
    } else if (tournament.status === 'active') {
      return {
        text: 'البطولة جارية حالياً',
        buttonClass: 'bg-gray-600 cursor-not-allowed',
        disabled: true
      };
    } else if (tournament.registeredCount >= tournament.maxParticipants) {
      return {
        text: 'اكتمل العدد',
        buttonClass: 'bg-gray-600 cursor-not-allowed',
        disabled: true
      };
    } else {
      return {
        text: 'التسجيل في البطولة',
        buttonClass: 'bg-red-600 hover:bg-red-700',
        disabled: false
      };
    }
  };

  const registrationStatus = getRegistrationStatus();

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent">
      {/* Hero Section */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <img 
          src="/api/placeholder/1200/400" // Replace with actual image in production
          alt={tournament.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
          <div className="container mx-auto">
            <div className={`inline-block ${getStatusBadgeClass(tournament.status)} px-3 py-1 rounded-full text-sm font-medium mb-4`}>
              {getStatusInArabic(tournament.status)}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{tournament.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{tournament.date}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{tournament.startTime}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{tournament.registeredCount} / {tournament.maxParticipants} مشارك</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{tournament.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto mt-8 px-4">
        <Link href="/tournaments" className="inline-flex items-center text-blue-400 hover:text-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة إلى قائمة البطولات
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information Column */}
          <div className="lg:col-span-2">
            {/* Game Information */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">معلومات البطولة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-400 mb-1">اللعبة</h3>
                  <p className="text-lg">{tournament.game}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400 mb-1">نمط اللعب</h3>
                  <p className="text-lg">{tournament.gameMode}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400 mb-1">الموعد النهائي للتسجيل</h3>
                  <p className="text-lg">{tournament.registrationDeadline}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400 mb-1">مجموع الجوائز</h3>
                  <p className="text-lg text-red-500 font-bold">{tournament.prize}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">عن البطولة</h2>
              <p className="leading-relaxed text-gray-300">{tournament.description}</p>
            </div>

            {/* Rules */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">قواعد البطولة</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {tournament.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Schedule */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">جدول البطولة</h2>
              <div className="space-y-4">
                {tournament.schedule.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="w-24 md:w-32 flex-shrink-0 font-semibold text-red-500">
                      {item.time}
                    </div>
                    <div className="flex-grow border-r-2 border-gray-700 pr-4">
                      <div className="font-medium">{item.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results - Only show for completed tournaments */}
            {tournament.status === 'completed' && tournament.results && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">نتائج البطولة</h2>
                <div className="space-y-4">
                  {tournament.results.map((result, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-4">
                        {index === 0 && (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500 text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-400 text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                        )}
                        {index === 2 && (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-700 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                        )}
                        {index > 2 && (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-white">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold">{result.position}</div>
                        <div className="text-gray-300">{result.player}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Stream - Show only for active tournaments */}
            {tournament.status === 'active' && tournament.liveStreamLink && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">البث المباشر</h2>
                <p className="mb-4 text-gray-300">شاهد البطولة مباشرة على منصة Twitch</p>
                <a 
                  href={tournament.liveStreamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
                >
                  مشاهدة البث المباشر
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Organizers */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">منظمو البطولة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournament.organizers.map((organizer, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold">{organizer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{organizer.name}</h3>
                      <p className="text-gray-400">{organizer.role}</p>
                      <p className="text-sm text-gray-500">{organizer.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Registration Card */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-4">التسجيل</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">المشاركين</span>
                  <span className="font-bold">{tournament.registeredCount} / {tournament.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${(tournament.registeredCount / tournament.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {tournament.status === 'upcoming' && (
                <div className="mb-6">
                  <div className="text-gray-400 mb-2">الموعد النهائي للتسجيل</div>
                  <div className="font-bold text-xl">{tournament.registrationDeadline}</div>
                </div>
              )}

              <button 
                className={`w-full py-3 ${registrationStatus.buttonClass} rounded-md font-bold transition-colors`}
                disabled={registrationStatus.disabled}
              >
                {registrationStatus.text}
              </button>

              {tournament.status === 'upcoming' && !registrationStatus.disabled && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  بالضغط على زر التسجيل، أنت توافق على قواعد البطولة وشروطها
                </p>
              )}
            </div>

            {/* Prize Distribution */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">توزيع الجوائز</h2>
              <div className="space-y-4">
                {tournament.prizeDistribution.map((prize, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-300">{prize.position}</span>
                    <span className="font-bold">{prize.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tournaments */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">بطولات أخرى</h2>
              <div className="space-y-4">
                {tournamentsData
                  .filter(t => t.id !== tournament.id)
                  .slice(0, 3)
                  .map(relatedTournament => (
                    <Link 
                      href={`/tournaments/${relatedTournament.slug}`} 
                      key={relatedTournament.id}
                      className="block bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusBadgeClass(relatedTournament.status)}`}></div>
                        <span className="text-sm">{getStatusInArabic(relatedTournament.status)}</span>
                      </div>
                      <h3 className="font-bold mt-2">{relatedTournament.name}</h3>
                      <div className="text-gray-400 text-sm mt-1">{relatedTournament.date}</div>
                      <div className="text-gray-400 text-sm">{relatedTournament.game}</div>
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for the page
export function generateMetadata({ params }) {
  const { slug } = params;
  const tournament = tournamentsData.find(t => t.slug === slug);
  
  if (!tournament) {
    return {
      title: 'بطولة غير موجودة | Lava Gaming Center',
      description: 'لم يتم العثور على البطولة المطلوبة'
    };
  }
  
  return {
    title: `${tournament.name} | Lava Gaming Center`,
    description: tournament.description.substring(0, 160),
    openGraph: {
      title: `${tournament.name} | Lava Gaming Center`,
      description: tournament.description.substring(0, 160),
      images: [
        {
          url: tournament.image,
          width: 1200,
          height: 630,
          alt: tournament.name,
        },
      ],
    },
  };
}