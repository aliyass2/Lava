// server/dtos/news.dto.ts

export interface CreateNewsDto {
    title: string;
    description: string;
    date: string;   // ISO string; will be converted to Date in the service
    image: string;  // Base64 encoded string for the image
  }
  
  export interface UpdateNewsDto {
    title?: string;
    description?: string;
    date?: string;
    image?: string; // Base64 encoded string (if provided)
  }
  