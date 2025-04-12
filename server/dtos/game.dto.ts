// server/dtos/game.dto.ts

// Use a union for allowed platform strings (or import Platform enum from Prisma client)
export type PlatformType = 'PC' | 'Xbox' | 'PlayStation' | 'Nintendo' | 'Mobile';

export interface CreateGameDto {
  title: string;
  category: string;
  description: string;
  longDescription: string;
  features: string[];           // e.g. ["feature1", "feature2"]
  requirements?: any;           // e.g. { processor: "...", ram: "..." }
  screenshots: string[];        // URLs for screenshots
  videoUrl?: string;
  slug: string;
  popular: boolean;
  image: string;                // Base64 encoded string for the primary image
  platforms: PlatformType[];    // Array of platform strings; will convert to enum in service
}

export interface UpdateGameDto {
  title?: string;
  category?: string;
  description?: string;
  longDescription?: string;
  features?: string[];
  requirements?: any;
  screenshots?: string[];
  videoUrl?: string;
  slug?: string;
  popular?: boolean;
  image?: string;               // Base64 encoded image (if updating)
  platforms?: PlatformType[];
}
