// // pages/api/upload.js
// import nextConnect from 'next-connect';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';

// // Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Use memory storage for file uploads
// const upload = multer({ storage: multer.memoryStorage() });

// const apiRoute = nextConnect({
//   onError(error, req, res) {
//     console.error(error);
//     res.status(500).json({ error: `Something went wrong! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method ${req.method} not allowed` });
//   },
// });

// // Apply Multer middleware to parse multipart/form-data
// apiRoute.use(upload.single('file'));

// apiRoute.post(async (req, res) => {
//   try {
//     // Upload the file buffer to Cloudinary
//     const uploadPromise = new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: 'your-app-folder' }, // adjust folder name if necessary
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }
//       );
//       stream.end(req.file.buffer);
//     });

//     const result = await uploadPromise;
//     res.status(200).json({ message: 'Upload successful', data: result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'File upload failed.' });
//   }
// });

// // Disable default body parser for this API route
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default apiRoute;
