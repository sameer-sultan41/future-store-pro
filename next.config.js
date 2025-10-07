/** @type {import('next').NextConfig} */
const path = require("path");
const createNextIntlPlugin = require('next-intl/plugin');
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
  env: {
    IMG_URL: process.env.CLOUDINARY_URL,
  },
};
const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl(nextConfig);
