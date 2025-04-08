// server/services/game.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreateGameDto, UpdateGameDto } from '../dtos/game.dto';
import { Platform } from '@prisma/client'; // Import the Platform enum

export const getAllGames = async () => {
  return await prisma.game.findMany();
};

export const getGameById = async (id: string) => {
  return await prisma.game.findUnique({
    where: { id },
  });
};

export const createGame = async (data: CreateGameDto) => {
    return await prisma.game.create({
      data: {
        title: data.title,
        description: data.description,
        extraDescription: data.extraDescription,
        gameSpecs: data.gameSpecs,
        trailerUrl: data.trailerUrl,
        image: Buffer.from(data.image, 'base64'),
        // Convert string[] to Platform[]
        platforms: data.platforms.map((value: string) => value as Platform),
      },
    });
  };
  
  export const updateGame = async (id: string, data: UpdateGameDto) => {
    const updateData: any = { ...data };
    if (data.image) {
      updateData.image = Buffer.from(data.image, 'base64');
    }
    if (data.platforms) {
      updateData.platforms = data.platforms.map((value: string) => value as Platform);
    }
    return await prisma.game.update({
      where: { id },
      data: updateData,
    });
  };
export const deleteGame = async (id: string) => {
  return await prisma.game.delete({
    where: { id },
  });
};
