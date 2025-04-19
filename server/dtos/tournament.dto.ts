// server/dtos/tournament.dto.ts
import { TournamentStatus } from '@prisma/client';

export interface CreateTournamentDto {
  title: string;
  description: string;
  status: TournamentStatus;
  startDate: string;           // ISO string (e.g., "2025-06-01T10:00:00Z")
  endDate: string;             // ISO string
  rules: string[];             // Array of rules
  times: any;                  // JSON object for times configuration
  administrators: any;         // JSON object/list of administrator IDs
  prize: string;
  prizes: any;                 // JSON object/list for multiple prizes
  image: string;               // Cloudinary URL
}

export interface UpdateTournamentDto {
  title?: string;
  description?: string;
  status?: TournamentStatus;
  startDate?: string;
  endDate?: string;
  rules?: string[];
  times?: any;
  administrators?: any;
  prize?: string;
  prizes?: any;
  image?: string;
}
