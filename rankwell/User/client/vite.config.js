// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '')
//   const port = Number(env.VITE_PORT) || 5173
//   const host = env.VITE_HOST || true

//   return {
//     plugins: [react()],
//     server: {
//       host,
//       port
//     }
//   }
// })
 

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT) || 5173
  const host = env.VITE_HOST || true

  return {
    plugins: [
      react(),

      {
        name: 'inject-global-config-after-title',
        enforce: 'post',

        transformIndexHtml(html) {
          // remove existing (if already added somewhere else)
          html = html.replace(
            /<script\s+src="\.?\/global-config\.js"><\/script>/,
            ''
          )

          // inject RIGHT AFTER </title>
          return html.replace(
            /<\/title>/,
            `</title>\n    <script src="./global-config.js"></script>`
          )
        }
      }
    ],

    server: {
      host,
      port
    }
  }
})