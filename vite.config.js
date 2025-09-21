import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/esm\.sh\/yjs/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'yjs-esm-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 604800 // 7 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/esm\.sh\/@helia/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'helia-esm-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 604800 // 7 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/esm\.sh\/@crossmint/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'crossmint-esm-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 604800 // 7 days
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Etherith Memory Vault',
        short_name: 'Etherith',
        description: 'Decentralized Memory Vault with IPFS Storage',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ],

  // Build configuration
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },

  // Development server configuration
  server: {
    port: 3001,
    host: true,
    open: '/'
  },

  base: '/',

  css: {
    devSourcemap: true
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
})