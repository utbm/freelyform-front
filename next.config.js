const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add your alias here
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  env:{ NEXT_PUBLIC_BASE_API_URL : process.env.NEXT_PUBLIC_BASE_API_URL, BASE_API_URL : process.env.BASE_API_URL }
};

module.exports = nextConfig;
