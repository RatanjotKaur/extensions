import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'


export default defineConfig(({ command, mode }) => ({
plugins: [react()],
build: {
outDir: 'dist',
emptyOutDir: true,
rollupOptions: {
// include popup HTML and background as separate entry points
input: {
popup: resolve(__dirname, 'popup.html'),
background: resolve(__dirname, 'src/background.ts')
},
output: {
// keep predictable names for entry outputs so manifest can reference them
entryFileNames: '[name].js',
chunkFileNames: 'assets/[name].js',
assetFileNames: 'assets/[name].[ext]'
}
}
}
}))