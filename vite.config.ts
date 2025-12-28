import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat tags with 'perfect-' prefix as custom elements
          isCustomElement: (tag) => tag.startsWith('perfect-')
        }
      }
    }),
    dts({
      outDir: 'dist/types',
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PerfectAutocomplete',
      fileName: (format) => `perfect-autocomplete.${format}.js`,
      formats: ['es', 'umd', 'iife']
    },
    rollupOptions: {
      // Bundle everything for custom element distribution
      external: [],
      output: {
        globals: {}
      }
    },
    cssCodeSplit: false,
    minify: 'esbuild',
    sourcemap: true
  },

  define: {
    'import.meta.env.VITE_LIB_MODE': JSON.stringify(true)
  }
})
