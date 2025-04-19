// server/services/price.service.ts

import { prisma } from '@/lib/prisma/client';
import { CreatePriceDto, UpdatePriceDto } from '../dtos/price.dto';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// load your Cloudinary config...
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllPrices = () =>
  prisma.price.findMany();

export const getPriceById = (id: string) =>
  prisma.price.findUnique({ where: { id } });

export const createPrice = async (data: CreatePriceDto) => {
  // compute finalPrice if needed
  let computedFinal = data.finalPrice;
  if (data.discountRate != null && computedFinal == null) {
    computedFinal = data.price * ((100 - data.discountRate) / 100);
  }

  return prisma.price.create({
    data: {
      productName:  data.productName,
      mostused:     data.mostused,
      features:     data.features,
      time:         data.time,
      price:        data.price,
      discountRate: data.discountRate,
      finalPrice:   computedFinal,
      image:        data.image,
    },
  });
};

export const updatePrice = async (id: string, data: UpdatePriceDto) => {
  const updateData: Prisma.PriceUpdateInput = {};

  if (data.productName    != null) updateData.productName  = data.productName;
  if (data.mostused       != null) updateData.mostused     = data.mostused;
  if (data.features       != null) updateData.features     = { set: data.features };
  if (data.time           != null) updateData.time         = data.time;
  if (data.price          != null) updateData.price        = data.price;
  if (data.discountRate   != null) updateData.discountRate = data.discountRate;
  if (data.finalPrice     != null) updateData.finalPrice   = data.finalPrice;
  if (data.image          != null) updateData.image        = data.image;

  // if they updated price+discountRate but no explicit finalPrice, recompute
  if (data.discountRate != null && data.finalPrice == null && data.price != null) {
    updateData.finalPrice = data.price * ((100 - data.discountRate) / 100);
  }

  return prisma.price.update({
    where: { id },
    data: updateData,
  });
};

export const deletePrice = (id: string) =>
  prisma.price.delete({ where: { id } });
