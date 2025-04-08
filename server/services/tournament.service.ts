// server/services/tournament.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreateTournamentDto, UpdateTournamentDto } from '../dtos/tournament.dto';
import { Prisma } from '@prisma/client';

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
      // Convert ISO strings to Date objects
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      prize: data.prize,
      // Convert base64 image string to Buffer
      image: Buffer.from(data.image, 'base64'),
    },
  });
};

export const updateTournament = async (id: string, data: UpdateTournamentDto) => {
  let updateData: Prisma.TournamentUpdateInput = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  if (data.startDate !== undefined) {
    updateData.startDate = new Date(data.startDate);
  }
  if (data.endDate !== undefined) {
    updateData.endDate = new Date(data.endDate);
  }
  if (data.prize !== undefined) {
    updateData.prize = data.prize;
  }
  if (data.image !== undefined) {
    updateData.image = Buffer.from(data.image, 'base64');
  }

  return await prisma.tournament.update({
    where: { id },
    data: updateData,
  });
};

export const deleteTournament = async (id: string) => {
  return await prisma.tournament.delete({
    where: { id },
  });
};
