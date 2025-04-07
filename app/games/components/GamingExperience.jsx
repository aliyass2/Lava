// app/games/components/GamingExperience.jsx

export default function GamingExperience() {
  return (
    <section
      className="relative py-16 text-white overflow-hidden"
      style={{
        background: 'black',          // base color
        backgroundSize: 'cover',      // optional
        backgroundPosition: 'center', // optional
        backgroundAttachment: 'fixed' // optional
      }}
    >
      {/* Red gradient overlay from right to left */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-transparent to-50% pointer-events-none" />

      {/* Content container above overlay */}
      <div className="relative container mx-auto px-4 z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">تجربة لعب فريدة</h2>
          <p className="text-lg text-gray-300 mb-8">
            تمتع بتجربة لعب استثنائية مع أحدث أجهزة الألعاب وأنظمة الكمبيوتر المتطورة.
            نوفر لك بيئة مريحة وتنافسية للعب مع الأصدقاء والمنافسين.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-black bg-opacity-40 p-6 rounded-lg w-full sm:w-auto">
              <div className="text-red-500 text-3xl font-bold mb-2">+100</div>
              <div className="text-gray-300">لعبة متاحة</div>
            </div>
            <div className="bg-black bg-opacity-40 p-6 rounded-lg w-full sm:w-auto">
              <div className="text-red-500 text-3xl font-bold mb-2">60+</div>
              <div className="text-gray-300">جهاز حديث</div>
            </div>
          
          </div>
        </div>
      </div>
    </section>
  );
}
