// app/api/admin/[id]/route.ts
import {
    handleGetAdminById,
    handleUpdateAdmin,
    handleDeleteAdmin,
  } from '@/server/controllers/admin.controller';
  
  export async function GET(request: Request, { params }: { params: { id: string } }) {
    return await handleGetAdminById(params.id);
  }
  
  export async function PUT(request: Request, { params }: { params: { id: string } }) {
    return await handleUpdateAdmin(request, params.id);
  }
  
  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    return await handleDeleteAdmin(params.id);
  }
  