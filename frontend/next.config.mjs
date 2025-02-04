const nextConfig = {
  reactStrictMode: false,

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
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://192.168.x.x:8080/api/:path*', // DEV
        destination: 'http://backend:8080/api/:path*', // PROD

      },
    ];
  },
};

export default nextConfig;
