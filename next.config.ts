/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "public-images-carbucloud.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
    ],
  },
};

module.exports = nextConfig;
