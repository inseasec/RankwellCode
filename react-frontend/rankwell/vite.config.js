import {defineConfig} from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [tailwindcss()],
    server: {
        host: true,
        port: 80,
        strictPort: true,
        allowedHosts: ['.edtech.com', 'localhost', '127.0.0.1'],
        proxy: {
            '/auth': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/organization': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
})
