// server/controllers/admin.controller.ts
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
} from '../services/admin.service';
import { CreateAdminDto, UpdateAdminDto } from '../dtos/admin.dto';

export const handleGetAllAdmins = async () => {
  const admins = await getAllAdmins();
  return new Response(JSON.stringify(admins), { status: 200 });
};

export const handleGetAdminById = async (id: string) => {
  const admin = await getAdminById(id);
  if (!admin) return new Response('Admin not found', { status: 404 });
  return new Response(JSON.stringify(admin), { status: 200 });
};

export const handleCreateAdmin = async (req: Request) => {
  const body: CreateAdminDto = await req.json();
  const newAdmin = await createAdmin(body);
  return new Response(JSON.stringify(newAdmin), { status: 201 });
};

export const handleUpdateAdmin = async (req: Request, id: string) => {
  const body: UpdateAdminDto = await req.json();
  const updatedAdmin = await updateAdmin(id, body);
  return new Response(JSON.stringify(updatedAdmin), { status: 200 });
};

export const handleDeleteAdmin = async (id: string) => {
  await deleteAdmin(id);
  return new Response(null, { status: 204 });
};

export const handleLoginAdmin = async (req: Request) => {
  try {
    const { username, password } = await req.json();
    const token = await loginAdmin(username, password);
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
};
