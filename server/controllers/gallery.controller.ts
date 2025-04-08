// server/controllers/gallery.controller.ts

import {
    getAllGalleries,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGallery,
  } from '../services/gallery.service';
  import { CreateGalleryDto, UpdateGalleryDto } from '../dtos/gallery.dto';
  
  export async function handleGetAllGalleries() {
    try {
      const galleries = await getAllGalleries();
      return new Response(JSON.stringify(galleries), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch galleries' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleGetGalleryById(id: string) {
    try {
      const gallery = await getGalleryById(id);
      if (!gallery) return new Response('Gallery not found', { status: 404 });
      return new Response(JSON.stringify(gallery), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch gallery' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleCreateGallery(req: Request) {
    try {
      const body: CreateGalleryDto = await req.json();
      const newGallery = await createGallery(body);
      return new Response(JSON.stringify(newGallery), { status: 201 });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to create gallery' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleUpdateGallery(req: Request, id: string) {
    try {
      const body: UpdateGalleryDto = await req.json();
      const updatedGallery = await updateGallery(id, body);
      return new Response(JSON.stringify(updatedGallery), { status: 200 });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to update gallery' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleDeleteGallery(id: string) {
    try {
      await deleteGallery(id);
      return new Response(null, { status: 204 });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: 'Failed to delete gallery' }),
        { status: 500 }
      );
    }
  }
  