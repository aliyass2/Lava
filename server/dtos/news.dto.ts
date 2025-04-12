// server/dtos/news.dto.ts

export interface CreateNewsDto {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;     // ISO date string (e.g., "2025-04-02T00:00:00Z" or simply "2 أبريل 2025" if you parse it appropriately)
  image: string;    // Image URL or path (e.g., "/temp/fifa.jpg")
  content: string;  // Full content/details text
}

export interface UpdateNewsDto {
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  image?: string;
  content?: string;
}
