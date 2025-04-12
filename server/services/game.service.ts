// server/services/game.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreateGameDto, UpdateGameDto, PlatformType } from '../dtos/game.dto';
import { Prisma } from '@prisma/client';
import { Platform as PrismaPlatform } from '@prisma/client';

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
      category: data.category,
      description: data.description,
      longDescription: data.longDescription,
      features: data.features,
      requirements: data.requirements,
      screenshots: data.screenshots,
      videoUrl: data.videoUrl,
      slug: data.slug,
      popular: data.popular,
      image: Buffer.from(data.image, 'base64'),
      platforms: data.platforms.map((p: PlatformType) => p as PrismaPlatform)
    },
  });
};

export const updateGame = async (id: string, data: UpdateGameDto) => {
  let updateData: Prisma.GameUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.longDescription !== undefined) updateData.longDescription = data.longDescription;
  if (data.features !== undefined) updateData.features = data.features;
  if (data.requirements !== undefined) updateData.requirements = data.requirements;
  if (data.screenshots !== undefined) updateData.screenshots = data.screenshots;
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.popular !== undefined) updateData.popular = data.popular;
  if (data.image !== undefined) {
    updateData.image = Buffer.from(data.image, 'base64');
  }
  if (data.platforms !== undefined) {
    updateData.platforms = data.platforms.map((p: PlatformType) => p as any);
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
