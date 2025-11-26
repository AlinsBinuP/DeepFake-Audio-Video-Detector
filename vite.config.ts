import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to resolve TS error with process.cwd() when node types are missing
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // critical: maps process.env.API_KEY to the environment variable at build time
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});