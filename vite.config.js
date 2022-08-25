import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig(() => {
  return {
    ssr: {
      target: 'node',
      noExternal: true
    },
    build: {
      ssr: true,
      outDir: '.',
      sourcemap: false,
      lib: {
        formats: ['cjs'],
        entry: resolve(__dirname, 'lib/index.ts'),
        fileName: 'main'
      },
      rollupOptions: {
        external: ['path', 'fs', 'http', 'https', 'url', 'zlib', 'util', 'assert', 'stream', 'constants', 'events']
      },
      minify: true
    }
  }
})
