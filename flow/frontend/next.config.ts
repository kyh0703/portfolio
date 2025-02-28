import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: true,
  /* config options here */
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  output: 'standalone',
}

export default nextConfig
