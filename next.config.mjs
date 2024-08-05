/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback, // Preserve other defaults
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          dns: false, // Include additional Node.js modules if needed
        };
      }
      return config;
    },
  };
  
  export default nextConfig;
  