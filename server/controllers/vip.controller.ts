// server/controllers/vip.controller.ts
import {
    getAllVips,
    getVipById,
    createVip,
    updateVip,
    deleteVip,
  } from '../services/vip.service';
  import { CreateVipDto, UpdateVipDto } from '../dtos/vip.dto';
  
  export async function handleGetAllVips() {
    try {
      const vips = await getAllVips();
      return new Response(JSON.stringify(vips), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error("Error fetching VIPs:", error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch VIPs',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  export async function handleGetVipById(id: string) {
    try {
      const vip = await getVipById(id);
      if (!vip) {
        return new Response(JSON.stringify({ error: 'VIP not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify(vip), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error("Error fetching VIP:", error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch VIP',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  export async function handleCreateVip(req: Request) {
    try {
      const body = await req.json();
      
      // Validate required fields
      if (!body.name || !body.description || body.price === undefined || !body.platform) {
        return new Response(
          JSON.stringify({ error: 'Name, description, price, and platform are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate price is a positive number
      if (typeof body.price !== 'number' || body.price <= 0) {
        return new Response(
          JSON.stringify({ error: 'Price must be a positive number' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate discount if provided
      if (body.discount !== undefined && (typeof body.discount !== 'number' || body.discount < 0 || body.discount > 100)) {
        return new Response(
          JSON.stringify({ error: 'Discount must be a number between 0 and 100' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const data: CreateVipDto = {
        name: body.name,
        description: body.description,
        price: body.price,
        discount: body.discount,
        platform: body.platform,
      };
  
      const newVip = await createVip(data);
      return new Response(JSON.stringify(newVip), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Error creating VIP:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create VIP',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  export async function handleUpdateVip(req: Request, id: string) {
    try {
      const body = await req.json();
      
      // Validate price if provided
      if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
        return new Response(
          JSON.stringify({ error: 'Price must be a positive number' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate discount if provided
      if (body.discount !== undefined && (typeof body.discount !== 'number' || body.discount < 0 || body.discount > 100)) {
        return new Response(
          JSON.stringify({ error: 'Discount must be a number between 0 and 100' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const updateData: UpdateVipDto = {};
      if (body.name !== undefined) updateData.name = body.name;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.price !== undefined) updateData.price = body.price;
      if (body.discount !== undefined) updateData.discount = body.discount;
      if (body.platform !== undefined) updateData.platform = body.platform;
  
      const updatedVip = await updateVip(id, updateData);
      return new Response(JSON.stringify(updatedVip), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Error updating VIP:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update VIP',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  export async function handleDeleteVip(id: string) {
    try {
      await deleteVip(id);
      return new Response(null, { status: 204 });
    } catch (error: any) {
      console.error('Error deleting VIP:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to delete VIP',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }