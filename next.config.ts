/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com", // Cloudinary
      "via.placeholder.com", // Placeholder images
      "assets.aceternity.com", // Aceternity UI logo
      "images.unsplash.com", // ✅ Add Unsplash,
      "storage.googleapis.com"
    ],
  },
};

module.exports = nextConfig;
