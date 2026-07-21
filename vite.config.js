import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 讓打包後的檔案可直接放在 GitHub Pages 任何路徑下運作
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'docs',
  },
})
