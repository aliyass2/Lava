// server/services/news.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';

export const getAllNews = async () => {
  return await prisma.news.findMany();
};

export const getNewsById = async (id: string) => {
  return await prisma.news.findUnique({
    where: { id },
  });
};

export const createNews = async (data: CreateNewsDto) => {
  return await prisma.news.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      image: Buffer.from(data.image, 'base64'),
    },
  });
};

export const updateNews = async (id: string, data: UpdateNewsDto) => {
  const updateData: any = { ...data };

  if (data.date) {
    updateData.date = new Date(data.date);
  }

  if (data.image) {
    updateData.image = Buffer.from(data.image, 'base64');
  }

  return await prisma.news.update({
    where: { id },
    data: updateData,
  });
};

export const deleteNews = async (id: string) => {
  return await prisma.news.delete({
    where: { id },
  });
};
