/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "localhost", "developers.google.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "developers.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ssl.cdn-redfin.com",
        port: "",
        pathname: "/photo/rent/**",
      },
    ],
  },
};

export default nextConfig;
