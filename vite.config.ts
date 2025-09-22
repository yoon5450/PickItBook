// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { fileURLToPath, URL } from 'node:url';
// import tailwindcss from '@tailwindcss/vite'
// // https://vite.dev/config/

// const viteConfig = defineConfig({
//   base: '/',
//   server: {
//     host: 'localhost',
//     port: 3000,
//     open: false,
//   },
//   plugins: [react(),
//     tailwindcss()
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url)),
//     },
//   },
// });

// export default viteConfig;

// 미리할걸
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  server: {
    host: 'localhost',
    port: 3000,
    open: false,
    proxy: {
      // 프론트에서 호출: /api/data4library/...
      '/api/data4library': {
        // target: 'https://data4library.kr', // HTTPS 지원 시 권장
        target: 'http://data4library.kr', // HTTPS 미지원이면 이거
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/data4library/, ''),
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

