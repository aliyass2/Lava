/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  api: {
    bodyParser: {
      sizeLimit: '20mb',   // ← bump this to whatever you need
    },
  },
}

export default nextConfig
