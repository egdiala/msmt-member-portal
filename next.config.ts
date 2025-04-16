import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      { hostname: "plus.unsplash.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "msmtavatarstorage.blob.core.windows.net" },
    ],
  },
  // basePath: '/home',
  // async redirects() {
  // 	return [
  // 		{
  // 			source: '/',
  // 			destination: '/home',
  // 			basePath: false,
  // 			permanent: false
  // 		}
  // 	]
  // },
  reactStrictMode: true,
};

export default nextConfig;
