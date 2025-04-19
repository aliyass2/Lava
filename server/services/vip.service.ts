// server/services/vip.service.ts
import { prisma } from '@/lib/prisma/client';
import { CreateVipDto, UpdateVipDto } from '../dtos/vip.dto';

export const getAllVips = async () => {
  return await prisma.vip.findMany();
};

export const getVipById = async (id: string) => {
  return await prisma.vip.findUnique({ where: { id } });
};

export const createVip = async (data: CreateVipDto) => {
  // Calculate the final price if discount is provided
  const finalPrice = data.discount ? data.price - (data.price * data.discount / 100) : data.price;
  
  return await prisma.vip.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      discount: data.discount,
      finalPrice,
      platform: data.platform,
    },
  });
};

export const updateVip = async (id: string, data: UpdateVipDto) => {
  // Get the current VIP to calculate the final price if needed
  const currentVip = await prisma.vip.findUnique({ where: { id } });
  if (!currentVip) {
    throw new Error('VIP not found');
  }
  
  // Calculate the final price based on updated or existing values
  const price = data.price !== undefined ? data.price : currentVip.price;
  const discount = data.discount !== undefined ? data.discount : currentVip.discount;
  const finalPrice = discount ? price - (price * discount / 100) : price;
  
  return await prisma.vip.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.discount !== undefined && { discount: data.discount }),
      finalPrice,
      ...(data.platform !== undefined && { platform: data.platform }),
    },
  });
};

export const deleteVip = async (id: string) => {
  return await prisma.vip.delete({ where: { id } });
};