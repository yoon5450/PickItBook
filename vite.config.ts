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
      // 프론트가 호출하는 경로 그대로 유지
      "/api/data4library": {
        target: "http://3.35.131.185", // 도메인 붙이기 전엔 http + IP
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/data4library/, "/api"),
        //공유 토큰을 헤더로 넣고 싶을 때:
        // headers: { "x-proxy-token": process.env.VITE_PROXY_TOKEN as string },
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

