// server/dtos/game.dto.ts

export interface CreateGameDto {
    title: string;
    description: string;
    extraDescription?: string;
    gameSpecs?: any; // You can refine the type if you have a strict shape in mind
    trailerUrl?: string;
    image: string;   // Base64 encoded string for the image
    platforms: string[]; // Use string array that matches your Platform enum values
  }
  
  export interface UpdateGameDto {
    title?: string;
    description?: string;
    extraDescription?: string;
    gameSpecs?: any;
    trailerUrl?: string;
    image?: string;  // Base64 encoded string; optional if not updating
    platforms?: string[];
  }
  