import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // need to make reducer pure first..
  reactStrictMode: false,
}

export default nextConfig
