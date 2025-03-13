module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
      return [
          {
              source: "/api/:path*",
              headers: [
                  {
                      key: "Access-Control-Allow-Origin",
                      value: "https://32d7-2001-4451-8712-1800-91e2-26cf-1dd-5068.ngrok-free.app",
                  },
                  {
                      key: "Access-Control-Allow-Credentials",
                      value: "true",
                  },
                  {
                      key: "Access-Control-Allow-Methods",
                      value: "GET, POST, PUT, DELETE, OPTIONS",
                  },
                  {
                      key: "Access-Control-Allow-Headers",
                      value: "Content-Type, Authorization",
                  },
              ],
          },
      ];
  },
};
