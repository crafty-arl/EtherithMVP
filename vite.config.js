import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/discord\.com\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'discord-api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.discordapp\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'discord-cdn-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Etherith - Memory Archive',
        short_name: 'Etherith',
        description: 'Decentralized memory archiving with peer-to-peer sharing',
        theme_color: '#5865F2',
        background_color: '#2C2F33',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],

  // Build configuration
  build: {
    target: 'es2020',
    outDir: 'dist',
    copyPublicDir: true,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        dashboard: 'dashboard.html',
        upload: 'upload.html',
        memories: 'memories.html',
        shared: 'shared.html',
        peers: 'peers.html'
      },
      output: {
        manualChunks: {
          auth: ['./src/js/auth.js'],
          helia: ['./src/js/helia.js'],
          utils: ['./src/js/utils.js']
        }
      }
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true
  },

  base: '/',

  css: {
    devSourcemap: true
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})
