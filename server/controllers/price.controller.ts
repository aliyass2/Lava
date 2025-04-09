// server/controllers/price.controller.ts

import {
    getAllPrices,
    getPriceById,
    createPrice,
    updatePrice,
    deletePrice,
  } from '../services/price.service';
  import { CreatePriceDto, UpdatePriceDto } from '../dtos/price.dto';
  
  export async function handleGetAllPrices() {
    try {
      const prices = await getAllPrices();
      return new Response(JSON.stringify(prices), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch prices' }), { status: 500 });
    }
  }
  
  export async function handleGetPriceById(id: string) {
    try {
      const price = await getPriceById(id);
      if (!price) return new Response('Price not found', { status: 404 });
      return new Response(JSON.stringify(price), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch price' }), { status: 500 });
    }
  }
  
  export async function handleCreatePrice(req: Request) {
    try {
      const body: CreatePriceDto = await req.json();
      const newPrice = await createPrice(body);
      return new Response(JSON.stringify(newPrice), { status: 201 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message || 'Failed to create price' }), { status: 500 });
    }
  }
  
  export async function handleUpdatePrice(req: Request, id: string) {
    try {
      const body: UpdatePriceDto = await req.json();
      const updatedPrice = await updatePrice(id, body);
      return new Response(JSON.stringify(updatedPrice), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message || 'Failed to update price' }), { status: 500 });
    }
  }
  
  export async function handleDeletePrice(id: string) {
    try {
      await deletePrice(id);
      return new Response(null, { status: 204 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: 'Failed to delete price' }), { status: 500 });
    }
  }
  