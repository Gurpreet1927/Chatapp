// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//  base: '/chat/',  // ✅ GitHub repo name for Pages
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/chat/',  // GitHub repo name for Pages
  build: {
    outDir: 'docs',
  },
  plugins: [react(), tailwindcss()],
  server: {
    // eslint-disable-next-line no-undef
    hmr: process.env.NODE_ENV === 'development', // disable HMR in production
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

