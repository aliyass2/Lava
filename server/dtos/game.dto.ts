export interface CreateGameDto {
  title: string;
  category: string;
  description: string;
  longDescription: string;
  videoUrl?: string;
  popular: boolean;
  image: string; // Cloudinary URL string for the primary image.
}

export interface UpdateGameDto {
  title?: string;
  category?: string;
  description?: string;
  longDescription?: string;
  videoUrl?: string;
  popular?: boolean;
  image?: string; // Cloudinary URL string (if updating)
}
