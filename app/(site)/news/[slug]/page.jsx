// app/news/[slug]/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// Import the shared news articles data
import { newsArticles } from '../newsData';

// Generate static params for all news articles at build time
export async function generateStaticParams() {
  return newsArticles.map((article) => ({ 
    slug: article.slug 
  }));
}

export default function NewsDetailPage({ params }) {
  // Get the slug from the URL parameters
  const { slug } = params;
  
  // Log the slug (this will appear in server logs)
  console.log('Looking for article with slug:', slug);
  
  // Find the matching news article based on the slug
  const article = newsArticles.find((item) => item.slug === slug);
  
  // If no article is found with the given slug, show a 404 page
  if (!article) {
    console.log('Article not found for slug:', slug);
    notFound();
  }
  
  console.log('Found article:', article.title);

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          href="/news" 
          className="inline-block mb-6 text-yellow-500 hover:text-yellow-400"
        >
          &larr; العودة إلى الأخبار
        </Link>
        
        {/* Article title */}
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        
        {/* Article metadata */}
        <div className="flex items-center mb-6">
          <span className="text-yellow-500 text-sm mr-4">{article.category}</span>
          <span className="text-gray-400 text-sm">{article.date}</span>
        </div>
        
        {/* Article image */}
        <div className="relative w-full h-96 mb-8">
          <Image
            src={article.imageSrc}
            alt={article.title}
            fill
            className="object-cover rounded"
          />
        </div>
        
        {/* Article description/summary */}
        <div className="text-lg font-medium text-gray-300 mb-8">
          {article.description}
        </div>
        
        {/* Article content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-white leading-relaxed whitespace-pre-line">
            {article.content}
          </p>
        </div>
        
        {/* Related articles */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-xl font-bold mb-4">مقالات ذات صلة</h3>
          <div className="flex flex-wrap gap-4">
            {newsArticles
              .filter(item => item.id !== article.id)
              .slice(0, 2)
              .map(relatedArticle => (
                <Link 
                  key={relatedArticle.id}
                  href={`/news/${relatedArticle.slug}`}
                  className="block p-4 bg-gray-800 rounded-lg w-full md:w-64"
                >
                  <h4 className="font-medium text-white mb-2">{relatedArticle.title}</h4>
                  <span className="text-yellow-500 text-xs">{relatedArticle.category}</span>
                </Link>
              ))
            }
          </div>
        </div>
      </main>
    </div>
  );
}