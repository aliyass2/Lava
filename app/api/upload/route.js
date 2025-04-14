// app/api/upload/route.js

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (ensure your environment variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Use Next.js built-in formData() to parse the multipart data.
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided under the "file" field.' },
        { status: 400 }
      );
    }

    // Convert the file (Blob) into an ArrayBuffer and then into a Buffer.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Build a Data URI string that Cloudinary can accept.
    const mimeType = file.type; // e.g., "image/png" or "image/jpeg"
    const base64String = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64String}`;

    // Upload the Data URI to Cloudinary. You can adjust options as needed.
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'your-app-folder', // Replace with the desired folder name in your Cloudinary account.
    });

    return NextResponse.json(
      { message: 'Upload successful', data: uploadResult },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}
