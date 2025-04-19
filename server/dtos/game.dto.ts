export interface CreateGameDto {
  title: string;
  category: string;
  description: string;
  longDescription: string;
  videoUrl?: string;
  popular: boolean;
  image: string;

  // New:
  systemSpecs: Record<string, string>; // e.g. { المعالج: "2 GHz", الذاكرة: "4 GB RAM", ... }
  features: string[];                  // e.g. ["أكثر من 140 بطلاً...", "أوضاع لعب متنوعة...", ...]
  screenshots: string[];               // Cloudinary URLs
}

export interface UpdateGameDto {
  title?: string;
  category?: string;
  description?: string;
  longDescription?: string;
  videoUrl?: string;
  popular?: boolean;
  image?: string;

  // New:
  systemSpecs?: Record<string, string>;
  features?: string[];
  screenshots?: string[];
}
