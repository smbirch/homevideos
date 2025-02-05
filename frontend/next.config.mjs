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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://192.168.x.x:8080/api/:path*', // DEV
        destination: 'http://homevideos.smbirch.com/api/:path*', // PROD
      },
    ];
  },
};

export default nextConfig;
