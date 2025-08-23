/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour ignorer les certificats auto-signés en développement
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Configuration pour les requêtes HTTPS en développement
  async rewrites() {
    return [];
  },
  // Configuration pour ignorer les certificats auto-signés
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignorer les certificats auto-signés pour les requêtes HTTPS en développement
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
