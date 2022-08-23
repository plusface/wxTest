// import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
export default defineConfig(({ command, mode }) => {
  const config = loadEnv(mode, '')
  console.log('[ config ]', config)
  return {
    build: {
      lib: {
        formats: ['cjs'],
        entry: resolve(__dirname, 'lib/index.ts'),
        // the proper extensions will be added
        fileName: 'index',
        name: 'wxTest'
      },
      rollupOptions: {},
      commonjsOptions: {
        // transformMixedEsModules: true, // build中支持cjs转esm
        requireReturnsDefault: true
      }
    },
    // https://vitejs.cn/guide/features.html#jsx
    esbuild: {},
    define: {
      'process.env': {
        ...config
      }
    },
    plugins: [
      // legacy({
      //   targets: ['defaults' /*  'IE => 11' */]
      // }),
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: false,
      proxy: {
        [config.VITE_WX_API_URL]: {
          target: config.VITE_API_TARGET,
          changeOrigin: true,
          ws: true,
          rewrite: path => path.replace(config.VITE_WX_API_URL, '/'),
          timeout: 1000 * 60 * 5,
          proxyTimeout: 1000 * 60 * 5
          // headers: {
          //     host: '192.168.0.131',
          //     ServerHost: '192.168.0.131',
          // }
        }
      }
    }
  }
})
