// server/services/tournament.service.ts
import { prisma } from '@/lib/prisma/client';
import { CreateTournamentDto, UpdateTournamentDto } from '../dtos/tournament.dto';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllTournaments = async () => {
  return await prisma.tournament.findMany();
};

export const getTournamentById = async (id: string) => {
  return await prisma.tournament.findUnique({ where: { id } });
};

export const createTournament = async (data: CreateTournamentDto) => {
  return await prisma.tournament.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      rules: data.rules,
      times: data.times,
      administrators: data.administrators,
      prize: data.prize,
      prizes: data.prizes,
      image: data.image,
    },
  });
};

export const updateTournament = async (id: string, data: UpdateTournamentDto) => {
  return await prisma.tournament.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.rules && { rules: data.rules }),
      ...(data.times && { times: data.times }),
      ...(data.administrators && { administrators: data.administrators }),
      ...(data.prize && { prize: data.prize }),
      ...(data.prizes && { prizes: data.prizes }),
      ...(data.image && { image: data.image }),
    },
  });
};

export const deleteTournament = async (id: string) => {
  return await prisma.tournament.delete({ where: { id } });
};

