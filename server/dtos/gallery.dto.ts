// server/dtos/gallery.dto.ts

export interface CreateGalleryDto {
    title: string;
    description: string;
    image: string; // Base64 encoded string for the image
  }
  
  export interface UpdateGalleryDto {
    title?: string;
    description?: string;
    image?: string; // Base64 encoded string for update
  }
  