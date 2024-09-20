import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://192.168.0.103:3000',
                changeOrigin: true,
                secure: false
            },
            '/chat': {
                target: 'http://192.168.0.103:3000',
                changeOrigin: true,
                secure: false
            }
        },
        port: 5000
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
})