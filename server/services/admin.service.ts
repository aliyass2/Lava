import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma/client";
import { signToken } from "@/lib/auth";                // 👈 central helper
import { CreateAdminDto, UpdateAdminDto } from "../dtos/admin.dto";

const SALT_ROUNDS = 10;

/* ──────────────────────────────────────────── CRUD ── */
export const getAllAdmins = () => prisma.admin.findMany();

export const getAdminById = (id: string) =>
  prisma.admin.findUnique({ where: { id } });

export const createAdmin = async (data: CreateAdminDto) => {
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  return prisma.admin.create({
    data: { username: data.username, password: hashed },
  });
};

export const updateAdmin = async (id: string, data: UpdateAdminDto) => {
  const next = { ...data };
  if (data.password) next.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  return prisma.admin.update({ where: { id }, data: next });
};

export const deleteAdmin = (id: string) =>
  prisma.admin.delete({ where: { id } });

/* ──────────────────────────────────────── LOGIN ── */
export const loginAdmin = async (username: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) throw new Error("Invalid credentials");

  // payload matches AuthToken interface used in /lib/auth.ts
// after: await the async signToken, so token is a string
const token = await signToken({ uid: admin.id, email: admin.username });
  return { token, admin: { id: admin.id, username: admin.username } };
};
