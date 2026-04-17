import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendPort = env.PORT || 5000;

  return {
    root: '.',
    base: '/',
    build: {
      outDir: 'dist/client',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': `http://127.0.0.1:${backendPort}`,
        '/config': `http://127.0.0.1:${backendPort}`,
      },
    },
  };
});
