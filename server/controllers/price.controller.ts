// server/controllers/price.controller.ts

import {
  getAllPrices,
  getPriceById,
  createPrice,
  updatePrice,
  deletePrice,
} from '../services/price.service';
import { CreatePriceDto, UpdatePriceDto } from '../dtos/price.dto';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

/** Helper: upload a File to Cloudinary */
function uploadFileToCloudinary(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'prices' },
      (error, result) => error ? reject(error) : resolve(result)
    );
    const nodeStream = Readable.fromWeb(file.stream() as any) as unknown as NodeJS.ReadableStream;
    nodeStream.pipe(uploadStream).on('error', reject);
  });
}

export async function handleGetAllPrices() {
  try {
    const prices = await getAllPrices();
    return new Response(JSON.stringify(prices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error("Error fetching prices:", err);
    return new Response(JSON.stringify({ error: 'Failed to fetch prices' }), { status: 500 });
  }
}

export async function handleGetPriceById(id: string) {
  try {
    const price = await getPriceById(id);
    if (!price) {
      return new Response(JSON.stringify({ error: 'Price not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(price), { status: 200 });
  } catch (err: any) {
    console.error("Error fetching price:", err);
    return new Response(JSON.stringify({ error: 'Failed to fetch price' }), { status: 500 });
  }
}

export async function handleCreatePrice(req: Request) {
  try {
    const formData = await req.formData();
    const productName = formData.get("productName")?.toString() || "";
    const mostused = formData.get("mostused")?.toString() === "true";
    // parse features (either multiple fields or a JSON array)
    const rawFeatures = formData.getAll("features");
    let features: string[] = [];
    rawFeatures.forEach(item => {
      if (typeof item === "string") {
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) features.push(...parsed);
          else features.push(item);
        } catch {
          features.push(item);
        }
      }
    });

    const time = Number(formData.get("time"));
    const price = Number(formData.get("price"));
    const discountRate = formData.get("discountRate") ? Number(formData.get("discountRate")) : undefined;
    const finalPrice = formData.get("finalPrice") ? Number(formData.get("finalPrice")) : undefined;

    const imageField = formData.get("image");
    if (!(imageField instanceof File)) {
      return new Response(JSON.stringify({ error: 'Image must be a File' }), { status: 400 });
    }
    const uploadResult = await uploadFileToCloudinary(imageField);
    const imageUrl = uploadResult.secure_url;

    const dto: CreatePriceDto = {
      productName,
      mostused,
      features,
      time,
      price,
      discountRate,
      finalPrice,
      image: imageUrl,
    };

    const newPrice = await createPrice(dto);
    return new Response(JSON.stringify(newPrice), { status: 201 });
  } catch (err: any) {
    console.error("Error creating price:", err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to create price' }), { status: 500 });
  }
}

export async function handleUpdatePrice(req: Request, id: string) {
  try {
    const formData = await req.formData();
    const dto: UpdatePriceDto = {};

    if (formData.has("productName")) dto.productName = formData.get("productName")!.toString();
    if (formData.has("mostused")) dto.mostused = formData.get("mostused")!.toString() === "true";

    // features
    if (formData.has("features")) {
      const rawFeatures = formData.getAll("features") as (string | File)[];
      const features: string[] = [];
      rawFeatures.forEach(item => {
        if (typeof item === "string") {
          try {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed)) features.push(...parsed);
            else features.push(item);
          } catch {
            features.push(item);
          }
        }
      });
      dto.features = features;
    }

    if (formData.has("time")) dto.time = Number(formData.get("time"));
    if (formData.has("price")) dto.price = Number(formData.get("price"));
    if (formData.has("discountRate")) dto.discountRate = Number(formData.get("discountRate"));
    if (formData.has("finalPrice")) dto.finalPrice = Number(formData.get("finalPrice"));

    if (formData.has("image")) {
      const imageField = formData.get("image");
      if (imageField instanceof File) {
        const uploadResult = await uploadFileToCloudinary(imageField);
        dto.image = uploadResult.secure_url;
      } else {
        dto.image = imageField!.toString();
      }
    }

    const updated = await updatePrice(id, dto);
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err: any) {
    console.error("Error updating price:", err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to update price' }), { status: 500 });
  }
}

export async function handleDeletePrice(id: string) {
  try {
    await deletePrice(id);
    return new Response(null, { status: 204 });
  } catch (err: any) {
    console.error("Error deleting price:", err);
    return new Response(JSON.stringify({ error: 'Failed to delete price' }), { status: 500 });
  }
}
