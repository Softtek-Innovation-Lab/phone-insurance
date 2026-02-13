import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimizaciones para reducir el tamaño del bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.log en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'heroui-vendor': [
            '@heroui/system',
            '@heroui/theme',
            '@heroui/button',
            '@heroui/input',
            '@heroui/card',
            '@heroui/modal',
            '@heroui/navbar',
            '@heroui/table',
            '@heroui/tabs',
          ],
          'utils-vendor': ['axios', 'ky', 'zod', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Configurar chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Comprimir assets
    assetsInlineLimit: 4096, // Inline assets < 4kb
  },
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@faker-js/faker'], // Excluir faker si no se usa en producción
  },
})
