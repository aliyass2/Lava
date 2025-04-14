export interface CreateTournamentDto {
  title: string;
  description: string;
  startDate: string; // ISO string (e.g., "2025-06-01T10:00:00Z")
  endDate: string;   // ISO string
  prize: string;
  image: string;     // Cloudinary URL
}

export interface UpdateTournamentDto {
  title?: string;
  description?: string;
  startDate?: string; // Optional ISO date string
  endDate?: string;
  prize?: string;
  image?: string;     // Optional Cloudinary URL for updating image
}