import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        treatments: resolve(__dirname, 'treatments.html'),
        categories: resolve(__dirname, 'categories.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        blog: resolve(__dirname, 'blog.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});
