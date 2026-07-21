/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/deodbdaxc/**",
      },
    ],
  },
  // Raise the body-size limit for API routes so multiple compressed images
  // (each ~400 KB after client-side resize) can be uploaded without Next.js
  // silently dropping the request and leaving the Send button stuck.
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
