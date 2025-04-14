import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@prisma/client';
import { CreateGalleryDto, UpdateGalleryDto } from '../dtos/gallery.dto';

export const getAllGalleries = async () => {
  return await prisma.gallery.findMany();
};

export const getGalleryById = async (id: string) => {
  return await prisma.gallery.findUnique({
    where: { id },
  });
};

export const createGallery = async (data: CreateGalleryDto) => {
  return await prisma.gallery.create({
    data: {
      title: data.title,
      description: data.description,
      image: data.image, // Cloudinary URL string for the image.
    },
  });
};

export const updateGallery = async (id: string, data: UpdateGalleryDto) => {
  let updateData: Prisma.GalleryUpdateInput = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  return await prisma.gallery.update({
    where: { id },
    data: updateData,
  });
};

export const deleteGallery = async (id: string) => {
  return await prisma.gallery.delete({
    where: { id },
  });
};
