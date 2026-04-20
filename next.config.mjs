/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Next.js automaticky zachytí všetko, čo ide na /api/...
        source: '/api/:path*',
        // A potichu to aj s COOKIES prepošle na Render backend
        destination: 'https://edukinder-backend.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
