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
      slug: data.slug,
      title: data.title,
      description: data.description,
      category: data.category,
      date: new Date(data.date),
      image: data.image,        // Store the image URL (or path) directly
      content: data.content,
    },
  });
};

export const updateNews = async (id: string, data: UpdateNewsDto) => {
  // Build the update object conditionally:
  const updateData: any = {};
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.image !== undefined) updateData.image = data.image;
  if (data.content !== undefined) updateData.content = data.content;
  
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
