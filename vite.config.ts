import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Usa uma configuração PostCSS local vazia e não herda arquivos de pastas superiores.
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: { host: true },
})
