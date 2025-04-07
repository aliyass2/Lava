'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Lava from './../../public/Lava.png';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <div className="relative">
      {/* Main navbar with right-to-left gradient */}
      <nav className="w-full py-4" 
        style={{
          background: 'linear-gradient(to left, #460809, #000000 25%)',
        }}>
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo - adjusted for better centering */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center justify-center">
                <Image 
                  src={Lava} 
                  alt="LAVA Gaming Center" 
                  width={120}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
          
          {/* Navigation Links - Right to Left for Arabic */}
          <div className="flex space-x-6 items-center text-white font-medium" dir="rtl">
            <Link 
              href="/" 
              className={`px-3 py-2 hover:text-red-500 transition ${pathname === '/' ? 'text-red-500' : ''}`}
            >
              الصفحة الرئيسية
            </Link>
            <Link 
              href="/games" 
              className={`px-3 py-2 hover:text-red-500 transition ${pathname === '/games' ? 'text-red-500' : ''}`}
            >
              الألعاب
            </Link>
            <Link 
              href="/news" 
              className={`px-3 py-2 hover:text-red-500 transition ${pathname === '/news' ? 'text-red-500' : ''}`}
            >
              الأخبار
            </Link>
            <Link 
              href="/products" 
              className={`px-3 py-2 hover:text-red-500 transition ${pathname === '/products' ? 'text-red-500' : ''}`}
            >
              المنتجات
            </Link>
            <Link 
              href="/pricing" 
              className={`px-3 py-2 hover:text-red-500 transition ${pathname === '/pricing' ? 'text-red-500' : ''}`}
            >
              الأسعار
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 hover:text-red-500 transition ${pathname === '/contact' ? 'text-red-500' : ''}`}
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Red line with glow effect */}
      <div className="w-full h-1 bg-red-700"></div>
      

    </div>
  );
}