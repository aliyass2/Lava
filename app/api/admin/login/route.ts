// app/api/admin/login/route.ts
import { handleLoginAdmin } from '@/server/controllers/admin.controller';

export async function POST(req: Request) {
  return await handleLoginAdmin(req);
}
