import { Geist, Geist_Mono } from "next/font/google";
import './../../(site)/globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// No usePathname since we'll handle active states differently
export default function AdminLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-100`}>
        {/* Admin Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <h1 className="text-2xl font-bold">لوحة تحكم المسؤول</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="بحث..." 
                  className="bg-gray-700 rounded-lg text-sm pr-10 pl-4 py-2 w-48 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-600"
                />
              </div>
              
              <Link 
                href="/" 
                className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                العودة للموقع
              </Link>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-4rem)] bg-gray-100">
          {/* Sidebar */}
          <aside className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <p className="text-lg font-medium">القائمة الرئيسية</p>
              <span className="flex items-center justify-center text-xs bg-red-600 text-white rounded-full w-6 h-6">6</span>
            </div>
            
            {/* Admin Info */}
            <div className="px-4 py-5 border-b border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold text-white">
                    أ
                  </div>
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-white">أحمد محمد</p>
                  <p className="text-xs text-gray-400">مشرف رئيسي</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  لوحة التحكم
                </h3>
                <ul className="space-y-1">
                  <SidebarItem href="/admin" icon="dashboard">
                    لوحة القيادة
                  </SidebarItem>
                </ul>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  إدارة المحتوى
                </h3>
                <ul className="space-y-1">
                  <SidebarItem href="/admin/users" icon="users">
                    المستخدمين
                  </SidebarItem>
                  
                  <SidebarItem href="/admin/tournaments" icon="tournament">
                    البطولات
                  </SidebarItem>
                  
                  <SidebarItem href="/admin/tournament-sections" icon="sections">
                    قسم البطولات 
                  </SidebarItem>
                  
                  <SidebarItem href="/admin/pricing" icon="pricing">
                    الاسعار
                  </SidebarItem>
                  
                  <SidebarItem href="/admin/news" icon="news">
                    الاخبار
                  </SidebarItem>
                </ul>
              </div>
              
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  النظام
                </h3>
                <ul className="space-y-1">
                  <SidebarItem href="/admin/settings" icon="settings">
                    الإعدادات
                  </SidebarItem>
                  
                  <SidebarItem href="/admin/logs" icon="logs">
                    سجلات النظام
                  </SidebarItem>
                </ul>
              </div>
            </nav>
            
            {/* Help Box */}
            <div className="mt-auto mx-4 mb-6 bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-white mr-2">تحتاج مساعدة؟</span>
              </div>
              <p className="text-xs text-gray-300 mb-3">يمكنك الوصول إلى مركز المساعدة لمزيد من المعلومات.</p>
              <Link 
                href="/admin/help" 
                className="text-xs bg-gray-600 hover:bg-gray-500 text-white w-full py-2 rounded flex items-center justify-center transition-colors"
              >
                مركز المساعدة
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">
            <div className="mb-6">
              <nav className="text-sm breadcrumbs">
                <ol className="flex items-center space-x-2 space-x-reverse">
                  <li><Link href="/admin" className="text-gray-600 hover:text-red-600">الرئيسية</Link></li>
                  <li className="text-gray-400 mx-2">/</li>
                  <li className="text-gray-900 font-medium">لوحة التحكم</li>
                </ol>
              </nav>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              {children}
            </div>
            
            {/* Footer */}
            <footer className="mt-8 text-center text-gray-500 text-sm py-4">
              <p>© 2025 لوحة تحكم المسؤول. جميع الحقوق محفوظة.</p>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}

// Sidebar item component with icons - removed active prop dependency
function SidebarItem({ href, icon, children }) {
  let iconSvg;
  
  const baseClasses = "flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-200 text-gray-300 hover:text-white hover:bg-gray-700";
  
  switch(icon) {
    case 'dashboard':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
      break;
    case 'users':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
      break;
    case 'tournament':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
      break;
    case 'sections':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
      break;
    case 'pricing':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
    case 'news':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      );
      break;
    case 'settings':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
      break;
    case 'logs':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
      break;
    default:
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }

  return (
    <li>
      <Link 
        href={href} 
        className={baseClasses}
      >
        {iconSvg}
        <span>{children}</span>
      </Link>
    </li>
  );
}