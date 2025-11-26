import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // No need to define process.env.API_KEY manually for Vite if using import.meta.env
    // But if we want to keep using process.env in code (not recommended for Vite), we'd keep it.
    // We will switch to import.meta.env in the service file.
  };
});