import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  proxy: {
    '/socket.io': 'http://localhost:5000',
    },
  server: {
    port: 5173,
  },
  define: {
    'process.env': {},
  },
});
