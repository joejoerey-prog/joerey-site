/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // cache optimized images for one week
  },
  reactStrictMode: true,
};

export default nextConfig;