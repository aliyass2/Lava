// app/news/page.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Import the shared news articles data
import { newsArticles } from './newsData';

export default function News() {
  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <main className="container mx-auto px-4 py-8">
        {/* News Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">أخبار المركز</h2>

        </div>

        {/* Featured News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {newsArticles.map((article) => (
            <div
              key={article.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Image Section */}
              <div className="relative h-48">
                <Image
                  src={article.imageSrc}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-md">
                  {article.category}
                </div>
                <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                  {article.date}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {article.description}
                </p>

                <Link
                  href={`/news/${article.slug}`}
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md text-sm font-medium"
                >
                  قراءة المزيد
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}