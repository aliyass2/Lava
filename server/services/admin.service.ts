// server/services/admin.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma/client';
import { CreateAdminDto, UpdateAdminDto } from '../dtos/admin.dto';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'; // Use a secure secret in production

export const getAllAdmins = async () => {
  return await prisma.admin.findMany();
};

export const getAdminById = async (id: string) => {
  return await prisma.admin.findUnique({
    where: { id },
  });
};

export const createAdmin = async (data: CreateAdminDto) => {
  // Hash the password before creating the admin
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  return await prisma.admin.create({
    data: {
      username: data.username,
      password: hashedPassword,
    },
  });
};

export const updateAdmin = async (id: string, data: UpdateAdminDto) => {
  // If updating the password, hash it
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  return await prisma.admin.update({
    where: { id },
    data: updateData,
  });
};

export const deleteAdmin = async (id: string) => {
  return await prisma.admin.delete({
    where: { id },
  });
};

export const loginAdmin = async (username: string, password: string) => {
  // Find the admin by username
  const admin = await prisma.admin.findUnique({
    where: { username },
  });
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  // Compare the provided password with the hashed password in DB
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  // Generate a JWT token with admin id and username as payload
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};
