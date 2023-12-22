/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        hostname: "tailwindui.com"
      }
    ]
  }
}

module.exports = nextConfig
