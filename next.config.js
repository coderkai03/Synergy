/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      's3.amazonaws.com',  // MLH images
      // Add any other domains you need to load images from
    ],
  },
}

export default nextConfig
