const nextConfig = {
  reactStrictMode: false,
  output: 'standalone', // ✅ Standalone mode enabled
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
