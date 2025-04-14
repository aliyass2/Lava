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

/**
 * Returns all prices as JSON.
 */
export async function handleGetAllPrices() {
  try {
    const prices = await getAllPrices();
    return new Response(JSON.stringify(prices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error fetching prices:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch prices' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Returns a single price record by ID.
 */
export async function handleGetPriceById(id: string) {
  try {
    const price = await getPriceById(id);
    if (!price)
      return new Response(JSON.stringify({ error: 'Price not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    return new Response(JSON.stringify(price), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error fetching price:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch price' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Helper: Upload a file from form-data to Cloudinary using a stream.
 */
function uploadFileToCloudinary(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'prices' }, // Save in a dedicated folder if you like.
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    // Convert the Web API File stream into a Node.js Readable stream.
    const nodeStream = Readable.fromWeb(file.stream() as any) as unknown as NodeJS.ReadableStream;
    nodeStream.pipe(uploadStream).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Create Price handler that expects form-data.
 * Keys: productName, time, price, discountRate, finalPrice (optional) and image (as File).
 */
export async function handleCreatePrice(req: Request) {
  try {
    const formData = await req.formData();
    const productName = formData.get("productName")?.toString() || "";
    const time = Number(formData.get("time"));
    const price = Number(formData.get("price"));
    const discountRate = formData.get("discountRate")
      ? Number(formData.get("discountRate"))
      : undefined;
    const finalPrice = formData.get("finalPrice")
      ? Number(formData.get("finalPrice"))
      : undefined;
    
    let imageUrl = "";
    const imageField = formData.get("image");
    if (!(imageField instanceof File)) {
      return new Response(JSON.stringify({ error: 'Image must be a valid file' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const uploadResult = await uploadFileToCloudinary(imageField);
    imageUrl = uploadResult.secure_url;

    const data: CreatePriceDto = {
      productName,
      time,
      price,
      discountRate,
      finalPrice,
      image: imageUrl, // Now a Cloudinary URL
    };

    const newPrice = await createPrice(data);
    return new Response(JSON.stringify(newPrice), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error creating price:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create price' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Update Price handler that expects form-data.
 * Only provided fields will be updated.
 */
export async function handleUpdatePrice(req: Request, id: string) {
  try {
    const formData = await req.formData();
    const productName = formData.get("productName")?.toString();
    const time = formData.get("time") ? Number(formData.get("time")) : undefined;
    const price = formData.get("price") ? Number(formData.get("price")) : undefined;
    const discountRate = formData.get("discountRate") ? Number(formData.get("discountRate")) : undefined;
    const finalPrice = formData.get("finalPrice") ? Number(formData.get("finalPrice")) : undefined;

    let image: string | undefined = undefined;
    const imageField = formData.get("image");
    if (imageField) {
      if (imageField instanceof File) {
        const uploadResult = await uploadFileToCloudinary(imageField);
        image = uploadResult.secure_url;
      } else if (typeof imageField === 'string') {
        image = imageField;
      }
    }

    const updateData: UpdatePriceDto = {};
    if (productName) updateData.productName = productName;
    if (time !== undefined) updateData.time = time;
    if (price !== undefined) updateData.price = price;
    if (discountRate !== undefined) updateData.discountRate = discountRate;
    if (finalPrice !== undefined) updateData.finalPrice = finalPrice;
    if (image) updateData.image = image;

    const updatedPrice = await updatePrice(id, updateData);
    return new Response(JSON.stringify(updatedPrice), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error updating price:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update price' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Delete Price handler.
 */
export async function handleDeletePrice(id: string) {
  try {
    await deletePrice(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting price:", error);
    return new Response(JSON.stringify({ error: 'Failed to delete price' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
