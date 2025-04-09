import Head from 'next/head';

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>من نحن | شركتنا المتميزة للخدمات</title>
        <meta
          name="description"
          content="تعرف على شركتنا المتميزة في تقديم الخدمات بمصداقية عالية ونظافة تامة وسرعة في التنفيذ. نسعى دائماً لتحقيق رضا العملاء."
        />
        <meta
          name="keywords"
          content="من نحن, خدمات, مصداقية, نظافة, سرعة الخدمة, خدمة العملاء"
        />
        <meta property="og:title" content="من نحن | شركتنا المتميزة للخدمات" />
        <meta
          property="og:description"
          content="تعرف على شركتنا المتميزة في تقديم الخدمات بمصداقية عالية ونظافة تامة وسرعة في التنفيذ."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="من نحن | شركتنا المتميزة للخدمات" />
        <meta
          name="twitter:description"
          content="تعرف على شركتنا المتميزة في تقديم الخدمات بمصداقية عالية ونظافة تامة وسرعة في التنفيذ."
        />
        <link rel="canonical" href="https://yourwebsite.com/about-us" />
      </Head>

      <main
        dir="rtl"
        className="relative py-16"
        style={{
          background: 'black',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
        }}
      >
        {/* Red linear gradient overlay from right to left */}
        <div className="absolute inset-0 bg-gradient-to-l from-red-950 to-50% to-transparent pointer-events-none"></div>

        <div className="relative">
          {/* Hero Section */}
          <section className="container mx-auto px-4 text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              من نحن
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نحن شركة متخصصة في تقديم أفضل الخدمات لعملائنا الكرام. نؤمن بأن
              ثقة العملاء هي أساس نجاحنا، ونسعى دائماً لتحقيق رضاهم من خلال
              التزامنا بقيمنا الأساسية.
            </p>
          </section>

          {/* Values Section */}
          <section className="container mx-auto px-4 mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              قيمنا الأساسية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Credibility Card */}
              <div className="bg-black bg-opacity-70 rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105 border border-blue-500">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-700 p-4 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-blue-500">
                  المصداقية في العمل
                </h3>
                <p className="text-gray-300 text-center">
                  نلتزم بمبدأ المصداقية في جميع تعاملاتنا. نقدم وعوداً واقعية ونعمل
                  بكل جهد لتحقيقها، مما يجعلنا محل ثقة عملائنا دائماً.
                </p>
              </div>

              {/* Cleanliness Card */}
              <div className="bg-black bg-opacity-70 rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105 border border-green-500">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-700 p-4 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-green-500">
                  النظافة
                </h3>
                <p className="text-gray-300 text-center">
                  نولي اهتماماً كبيراً للنظافة في جميع أعمالنا. نضمن تقديم خدماتنا
                  بأعلى معايير النظافة والجودة لنوفر بيئة صحية وآمنة لعملائنا.
                </p>
              </div>

              {/* Speed Card (Gold Accent) */}
              <div className="bg-black bg-opacity-70 rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105 border border-yellow-500">
                <div className="flex justify-center mb-6">
                  <div className="bg-yellow-700 p-4 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-yellow-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-yellow-500">
                  سرعة الخدمة
                </h3>
                <p className="text-gray-300 text-center">
                  نتميز بسرعة الاستجابة وتنفيذ الخدمات في الوقت المناسب. نقدر قيمة
                  وقت عملائنا ونسعى دائماً لإنجاز المهام بكفاءة عالية وفي أسرع وقت
                  ممكن.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
