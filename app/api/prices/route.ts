// app/api/prices/route.ts
import { handleGetAllPrices, handleCreatePrice } from '@/server/controllers/price.controller';

export async function GET() {
  return await handleGetAllPrices();
}

export async function POST(req: Request) {
  return await handleCreatePrice(req);
}
