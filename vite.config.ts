import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        '/api/hf': {
          target: 'https://api-inference.huggingface.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/hf/, ''),
        },
        '/api/youtube': {
          target: 'https://www.youtube.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/youtube/, ''),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          }
        },
      },
    },
    plugins: [react()],
  };
});