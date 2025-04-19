import { prisma } from '@/lib/prisma/client';
import { CreateGameDto, UpdateGameDto } from '../dtos/game.dto';
import { Prisma } from '@prisma/client';

export const getAllGames = async () => {
  return prisma.game.findMany();
};

export const getGameById = async (id: string) => {
  return prisma.game.findUnique({ where: { id } });
};

export const createGame = async (data: CreateGameDto) => {
  return prisma.game.create({
    data: {
      title: data.title,
      category: data.category,
      description: data.description,
      longDescription: data.longDescription,
      videoUrl: data.videoUrl,
      popular: data.popular,
      image: data.image,
      // New fields:
      systemSpecs: data.systemSpecs as Prisma.JsonValue,
      features: data.features,
      screenshots: data.screenshots,
    },
  });
};

export const updateGame = async (id: string, data: UpdateGameDto) => {
  const updateData: Prisma.GameUpdateInput = {};

  if (data.title !== undefined)         updateData.title           = data.title;
  if (data.category !== undefined)      updateData.category        = data.category;
  if (data.description !== undefined)   updateData.description     = data.description;
  if (data.longDescription !== undefined) updateData.longDescription = data.longDescription;
  if (data.videoUrl !== undefined)      updateData.videoUrl        = data.videoUrl;
  if (data.popular !== undefined)       updateData.popular         = data.popular;
  if (data.image !== undefined)         updateData.image           = data.image;

  // New:
  if (data.systemSpecs !== undefined)   updateData.systemSpecs     = data.systemSpecs as Prisma.JsonValue;
  if (data.features !== undefined)      updateData.features        = data.features;
  if (data.screenshots !== undefined)   updateData.screenshots     = data.screenshots;

  return prisma.game.update({
    where: { id },
    data: updateData,
  });
};

export const deleteGame = async (id: string) => {
  return prisma.game.delete({ where: { id } });
};
