// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Instead of importing, specify the path to the PostCSS config
export default defineConfig({
  plugins: [sveltekit()],
  css: {
    postcss: './postcss.config.cjs',
  }
});
