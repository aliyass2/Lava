// server/services/price.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreatePriceDto, UpdatePriceDto } from '../dtos/price.dto';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Ensure your Cloudinary configuration is loaded
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllPrices = async () => {
  return await prisma.price.findMany();
};

export const getPriceById = async (id: string) => {
  return await prisma.price.findUnique({
    where: { id },
  });
};

/**
 * Assumes that data.image is the Cloudinary URL.
 */
export const createPrice = async (data: CreatePriceDto) => {
  // Compute finalPrice if discountRate is provided and finalPrice is not sent.
  let computedFinalPrice = data.finalPrice;
  if (data.discountRate !== undefined && (data.finalPrice === undefined || data.finalPrice === null)) {
    computedFinalPrice = data.price * ((100 - data.discountRate) / 100);
  }
  
  return await prisma.price.create({
    data: {
      productName: data.productName,
      time: data.time,
      price: data.price,
      discountRate: data.discountRate,
      finalPrice: computedFinalPrice,
      image: data.image, // Store the Cloudinary URL directly
    },
  });
};

export const updatePrice = async (id: string, data: UpdatePriceDto) => {
  let updateData: Prisma.PriceUpdateInput = {};

  if (data.productName !== undefined) {
    updateData.productName = data.productName;
  }
  if (data.time !== undefined) {
    updateData.time = data.time;
  }
  if (data.price !== undefined) {
    updateData.price = data.price;
  }
  if (data.discountRate !== undefined) {
    updateData.discountRate = data.discountRate;
    if ((data.finalPrice === undefined || data.finalPrice === null) && data.price !== undefined) {
      updateData.finalPrice = data.price * ((100 - data.discountRate) / 100);
    }
  }
  if (data.finalPrice !== undefined) {
    updateData.finalPrice = data.finalPrice;
  }
  if (data.image !== undefined) {
    updateData.image = data.image; // New Cloudinary URL
  }

  return await prisma.price.update({
    where: { id },
    data: updateData,
  });
};

export const deletePrice = async (id: string) => {
  return await prisma.price.delete({
    where: { id },
  });
};
