// app/api/admin/route.ts
import { handleGetAllAdmins, handleCreateAdmin } from '@/server/controllers/admin.controller';

export async function GET() {
  return await handleGetAllAdmins();
}

export async function POST(req: Request) {
  return await handleCreateAdmin(req);
}
