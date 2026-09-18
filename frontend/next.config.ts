import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "p1-ofp.static.pub",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dlcdnwebimgs.asus.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.acer.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.intel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.amd.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
