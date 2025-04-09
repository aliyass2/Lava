// server/services/price.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreatePriceDto, UpdatePriceDto } from '../dtos/price.dto';
import { Prisma } from '@prisma/client';

export const getAllPrices = async () => {
  return await prisma.price.findMany();
};

export const getPriceById = async (id: string) => {
  return await prisma.price.findUnique({
    where: { id },
  });
};

export const createPrice = async (data: CreatePriceDto) => {
  // Compute finalPrice if discountRate is provided and finalPrice is not sent
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
      image: Buffer.from(data.image, 'base64'),
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
    // If finalPrice is not provided, recompute it (if price is available)
    if ((data.finalPrice === undefined || data.finalPrice === null) && data.price !== undefined) {
      updateData.finalPrice = data.price * ((100 - data.discountRate) / 100);
    }
  }
  if (data.finalPrice !== undefined) {
    updateData.finalPrice = data.finalPrice;
  }
  if (data.image !== undefined) {
    updateData.image = Buffer.from(data.image, 'base64');
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
