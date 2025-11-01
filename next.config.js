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
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Allow all remote images (for admin image previews)
    unoptimized: process.env.NODE_ENV === "development",
    // Add supported qualities to silence next/image warning when using quality={100}
    qualities: [75, 100],
  },
  env: {
    IMG_URL: process.env.CLOUDINARY_URL,
  },
};
const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl(nextConfig);
