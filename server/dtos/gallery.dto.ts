export interface CreateGalleryDto {
  title: string;
  description: string;
  image: string; // Cloudinary URL string for the image
}

export interface UpdateGalleryDto {
  title?: string;
  description?: string;
  image?: string; // Cloudinary URL string (if updating)
}
