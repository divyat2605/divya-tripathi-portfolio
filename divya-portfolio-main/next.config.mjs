/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 80, 95, 100],
  },
  allowedDevOrigins: ['192.168.1.13'],
};

export default nextConfig;
