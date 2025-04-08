// server/services/gallery.service.ts
import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@prisma/client'; // Import Prisma for the update input type
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
      // Convert base64 string to Buffer
      image: Buffer.from(data.image, 'base64'),
    },
  });
};

export const updateGallery = async (id: string, data: UpdateGalleryDto) => {
  // Construct an updateData object of type Prisma.GalleryUpdateInput
  let updateData: Prisma.GalleryUpdateInput = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  // Convert the image string to a Buffer if provided
  if (data.image !== undefined) {
    updateData.image = Buffer.from(data.image, 'base64');
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
