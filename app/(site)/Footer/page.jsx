'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Lava from './../../../public/Lava.png';
export default function Footer() {
  return (
    <footer className="text-gray-300" dir="rtl">
      {/* Main Footer */}
      <div className="relative overflow-hidden">
        {/* Background gradient like navbar */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to left, #460809, #000000 50%)',
          }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and About */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <div className="flex items-center">
                  <div className="bg-red-700 text-white font-bold text-xl px-3 py-2 rounded"><Image
                      src={Lava} 
                      alt="LAVA Gaming Center" 
                      width={80}
                      height={20}
                      className="object-contain"
                      priority
                  /></div>
                  <span className="mr-2 text-white text-xl font-bold">مركز الألعاب</span>
                </div>
              </Link>
              <p className="text-sm">
                Lava game center هو وجهتك المثالية لتجربة أحدث الألعاب وأفضل الأجهزة في أجواء احترافية. انضم إلينا للاستمتاع بتجربة لعب فريدة مع أصدقائك.
              </p>
              <div className="flex items-center space-x-4 space-x-reverse">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="تويتر" className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaTwitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="انستغرام" className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaInstagram size={20} />
                </a>
       
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-red-500 transition-colors">الصفحة الرئيسية</Link>
                </li>
                <li>
                  <Link href="/games" className="text-gray-400 hover:text-red-500 transition-colors">الألعاب</Link>
                </li>
                <li>
                  <Link href="/news" className="text-gray-400 hover:text-red-500 transition-colors">الأخبار</Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-red-500 transition-colors">المنتجات</Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-red-500 transition-colors">الأسعار</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-red-500 transition-colors">تواصل معنا</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">شارع الملك فهد، الرياض، المملكة العربية السعودية</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400" dir="ltr">+966 12 345 6789</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">info@lavagamecenter.com</span>
                </li>
              </ul>
            </div>
              <div className="mt-4">
                <h4 className="text-white text-md font-bold mb-2">ساعات العمل:</h4>
                <p className="text-gray-400">
                  كل يوم من 10 صباحاً حتى 12 منتصف الليل
                </p>
                <p className="text-gray-400">
                  الجمعة: من 2 ظهراً حتى 2 صباحاً
                </p>
              </div>

         
          </div>
        </div>
      </div>

      {/* Red line with glow effect */}
      <div className="w-full h-1 bg-red-700"></div>

      {/* Bottom Footer */}
      <div className="bg-black py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} مركز LAVA. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}