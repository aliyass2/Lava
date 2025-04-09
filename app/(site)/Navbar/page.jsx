'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Lava from './../../../public/Lava.png';
export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  // Add shadow effect when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation links array for easier management
  const navLinks = [
    { href: '/', label: 'الصفحة الرئيسية' },
    { href: '/games', label: 'الألعاب' },
    { href: '/news', label: 'الأخبار' },
    { href: '/tournaments', label: 'البطولات' },
    { href: '/pricing', label: 'الأسعار' },
    { href: '/contact', label: 'تواصل معنا' },
  ];
  
  return (
    <div className={`relative ${scrolled ? 'shadow-md' : ''} z-50`}>
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
          
          {/* Desktop Navigation Links - Hidden on small screens */}
          <div className="hidden md:flex space-x-6 items-center text-white font-medium" dir="rtl">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`px-3 py-2 hover:text-red-500 transition ${pathname === link.href ? 'text-red-500' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button - Visible only on small screens */}
          <button 
            className="md:hidden text-white focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-6 h-5">
              <span className={`absolute h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 top-2' : 'rotate-0 top-0'}`}></span>
              <span className={`absolute h-0.5 bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-full opacity-100'} top-2`}></span>
              <span className={`absolute h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 top-2' : 'rotate-0 top-4'}`}></span>
            </div>
          </button>
        </div>
      </nav>
      
      {/* Red line with glow effect */}
      <div className="w-full h-1 bg-red-700"></div>
      
      {/* Mobile Menu - Slide in from right for RTL layout */}
      <div 
        className={`md:hidden fixed top-0 right-0 w-64 h-full bg-gray-900 transform transition-transform duration-300 ease-in-out z-40 shadow-lg ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`block px-3 py-3 border-b border-gray-800 hover:bg-gray-800 hover:text-red-500 transition font-medium ${
                  pathname === link.href ? 'text-red-500' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay when mobile menu is open */}
      <div 
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>
    </div>
  );
}