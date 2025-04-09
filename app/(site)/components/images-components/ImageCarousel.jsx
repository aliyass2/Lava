// app/components/images-components/ImageCarousel.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function ImageCarousel({
  images,
  title = "معرض الصور",
  description = "استعرض مجموعتنا المتنوعة من الصور"
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Navigation functions
  const goToNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* SEO metadata in Arabic */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {images.length > 0 && <meta property="og:image" content={images[0].url} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <div className="relative h-[75vh] w-full overflow-hidden" aria-roledescription="carousel">
        {/* Red blur effect on the right */}
        <div className="absolute top-0 right-0 w-72 h-full bg-red-950 opacity-10 blur-3xl z-10"></div>
        
        {/* Carousel container */}
        <div 
          className="relative w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="flex h-full">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="min-w-full h-full relative flex-shrink-0"
                aria-hidden={currentSlide !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`الشريحة ${index + 1} من ${images.length}: ${image.title}`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image 
                    src={image.url}
                    alt={image.title || `صورة ${index + 1} من المعرض`}
                    fill
                    priority={index === 0}
                    quality={90}
                    sizes="100vw"
                    style={{
                      objectFit: 'cover',
                      filter: 'brightness(0.7)'
                    }}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
                
                {/* Overlay content - Text aligned right (RTL) */}
                <div className="absolute inset-0 flex flex-col items-end justify-center text-white p-12 text-right z-20">
                  <h2 className="text-6xl font-bold mb-4">{image.title}</h2>
                  <p className="text-xl mb-8">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none cursor-pointer z-30"
          onClick={goToPrev}
          aria-label="الشريحة السابقة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none cursor-pointer z-30"
          onClick={goToNext}
          aria-label="الشريحة التالية"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30" role="tablist">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                currentSlide === index 
                  ? 'bg-white'
                  : 'bg-transparent border border-white'
              }`}
              aria-label={`اذهب إلى الشريحة ${index + 1}`}
              aria-selected={currentSlide === index}
              role="tab"
            />
          ))}
        </div>
      </div>
    </>
  );
}