// app/news/[slug]/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'; // always server‑render

async function fetchArticleBySlug(slug) {
  const host = headers().get('host');
  if (!host) {
    console.error('Could not determine host for API request');
    return null;
  }

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/news`, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to load news list', res.status);
    return null;
  }

  const all = await res.json();
  return all.find(item => item.slug === slug) ?? null;
}

export default async function NewsDetailPage({ params }) {
  const { slug } = params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    // no match → 404
    notFound();
  }

  const dt = new Date(article.date);
  const formattedDate = dt.toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        <Link
          href="javascript:history.back()"
          className="inline-block mb-6 text-yellow-500 hover:text-yellow-400"
        >
          &larr; العودة 
        </Link>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center mb-6">
          <span className="text-yellow-500 text-sm ml-4">{article.category}</span>
          <span className="text-gray-400 text-sm">{formattedDate}</span>
        </div>

        <div className="relative w-full h-96 mb-8">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover rounded"
          />
        </div>

        <div className="text-lg font-medium text-gray-300 mb-8">
          {article.description}
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-white leading-relaxed whitespace-pre-line">
            {article.content}
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-xl font-bold mb-4">مقالات ذات صلة</h3>
          <div className="flex flex-wrap gap-4">
            {/* fetch related by reusing the list and filtering out current */}
            {/** You could pull the full list again, filter out `article.id`, 
                slice(0,2), and render similar Links **/}
          </div>
        </div>
      </main>
    </div>
  );
}
