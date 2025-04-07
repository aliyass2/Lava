import Image from 'next/image';
import Link from 'next/link';

export default function Gallery() {
  // Updated to use your actual image path '/temp/League.jpg'
  const galleryItems = [
    {
      id: 1,
      src: '/temp/League.jpg',
      alt: 'Gaming Setup with Multiple Monitors',
      href: '/gallery/gaming-setup'
    },
    {
      id: 2,
      src: '/temp/League.jpg',
      alt: 'Close-up of Gaming PC Setup',
      href: '/gallery/gaming-pc'
    },
    {
      id: 3,
      src: '/temp/League.jpg',
      alt: 'Custom PC Case with RGB Lighting',
      href: '/gallery/pc-case'
    },
    {
      id: 4,
      src: '/temp/League.jpg',
      alt: 'Gaming Console with Play Screen',
      href: '/gallery/gaming-console'
    },
    {
      id: 5,
      src: '/temp/League.jpg',
      alt: 'Arcade Gaming Machines',
      href: '/gallery/arcade'
    },
    {
      id: 6,
      src: '/temp/League.jpg',
      alt: 'Retro Gaming Setup',
      href: '/gallery/retro-gaming'
    },
  ];

  return (
    <section className="py-12 relative" style={{ backgroundColor: '#110a0f' }}>
      <div className="container mx-auto px-4">
        {/* Grid Gallery - First Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {galleryItems.slice(0, 3).map((item) => (
            <Link href={item.href} key={item.id} className="block relative rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="relative h-44 md:h-60 w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-80"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Grid Gallery - Second Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {galleryItems.slice(3, 6).map((item) => (
            <Link href={item.href} key={item.id} className="block relative rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="relative h-44 md:h-60 w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-80"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* See All Button */}
        <div className="flex justify-center mt-8">
          <Link 
            href="/gallery" 
            className="px-8 py-3 rounded-md bg-gray-800 text-white font-medium uppercase tracking-wider hover:bg-gray-700 transition-colors"
          >
            See All
          </Link>
        </div>
      </div>

      {/* Subtle neon glow effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1/3 h-1/3 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-pink-500 opacity-10 blur-3xl rounded-full"></div>
      </div>
    </section>
  );
}