import { handleGetAllVips, handleCreateVip } from '@/server/controllers/vip.controller';

export async function GET() {
  return await handleGetAllVips();
}

export async function POST(req: Request) {
  return await handleCreateVip(req);
}
