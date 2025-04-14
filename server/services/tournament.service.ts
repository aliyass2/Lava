// server/services/tournament.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreateTournamentDto, UpdateTournamentDto } from '../dtos/tournament.dto';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Ensure your Cloudinary configuration is loaded (or do this in a helper file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllTournaments = async () => {
  return await prisma.tournament.findMany();
};

export const getTournamentById = async (id: string) => {
  return await prisma.tournament.findUnique({
    where: { id },
  });
};

export const createTournament = async (data: CreateTournamentDto) => {
  return await prisma.tournament.create({
    data: {
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      prize: data.prize,
      image: data.image, // Store the Cloudinary URL directly
    },
  });
};


export const updateTournament = async (id: string, data: UpdateTournamentDto) => {
  return await prisma.tournament.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      prize: data.prize,
      image: data.image, // Update with the new Cloudinary URL
    },
  });
};
export const deleteTournament = async (id: string) => {
  return await prisma.tournament.delete({
    where: { id },
  });
};
