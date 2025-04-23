/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      // simple allow‑list
      domains: ['res.cloudinary.com'],
    },
  }
  
  export default nextConfig