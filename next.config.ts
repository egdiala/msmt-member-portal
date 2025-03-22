import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [{ hostname: "plus.unsplash.com" }],
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
