import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
    plugins: mode === 'test'
        ? []
        : [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    },
    define: {
        'import.meta.env.MODE': JSON.stringify(mode)
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
}))
