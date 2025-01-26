import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import tailwindcss from '@tailwindcss/vite';
// https://vitejs.dev/config
export default defineConfig({
  // css: {
  //   postcss,
  // },
  plugins: [react(), eslint(), tailwindcss()],
})
