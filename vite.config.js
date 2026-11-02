import { resolve } from 'path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import { canonicalPath, legacyPaths, siteRoutes } from './site-routes.js';

const pages = new Map(siteRoutes.map(route => [route.path, route]));

function pageMiddleware(production) {
  return (req, res, next) => {
    if (!req.url || !['GET', 'HEAD'].includes(req.method)) return next();
    const url = new URL(req.url, 'http://localhost');
    const path = canonicalPath(url.pathname);
    const route = pages.get(path);
    if (!route) return next();

    if (path !== url.pathname) {
      res.writeHead(308, { Location: `${path}${url.search}` });
      return res.end();
    }

    req.url = production && path !== '/'
      ? `${path}/index.html${url.search}`
      : `/${route.file}${url.search}`;
    next();
  };
}

export default defineConfig({
  server: {
    port: 5175,
  },
  plugins: [
    {
      name: 'clean-urls-and-routes',
      configureServer(server) {
        server.middlewares.use(pageMiddleware(false));
      },
      configurePreviewServer(server) {
        server.middlewares.use(pageMiddleware(true));
      },
      async writeBundle(outputOptions) {
        const outDir = resolve(outputOptions.dir || 'dist');
        // Emit real directories so clean URLs also work on static hosting.
        for (const route of siteRoutes) {
          if (route.path === '/') continue;
          const html = await readFile(resolve(outDir, route.file), 'utf8');
          const directory = resolve(outDir, route.path.slice(1));
          await mkdir(directory, { recursive: true });
          await writeFile(resolve(directory, 'index.html'), html);
        }
        await writeFile(resolve(outDir, '_redirects'), [...legacyPaths]
          .map(([alias, path]) => `${alias} ${path} 301`).join('\n') + '\n');
      },
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        about1: resolve(import.meta.dirname, 'about-1.html'),
        blankPage: resolve(import.meta.dirname, 'blank-page.html'),
        blogArticle: resolve(import.meta.dirname, 'blog-article.html'),
        blogTopics: resolve(import.meta.dirname, 'blog-topics.html'),
        blog: resolve(import.meta.dirname, 'blog.html'),
        categories: resolve(import.meta.dirname, 'categories.html'),
        categories1: resolve(import.meta.dirname, 'categories-1.html'),
        categorySkincare: resolve(import.meta.dirname, 'category-skincare.html'),
        categoryHairBody: resolve(import.meta.dirname, 'category-hair-body.html'),
        categoryMakeUp: resolve(import.meta.dirname, 'category-make-up.html'),
        categoryBeauty: resolve(import.meta.dirname, 'category-beauty.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        contact1: resolve(import.meta.dirname, 'contact-1.html'),
        equipmentCms: resolve(import.meta.dirname, 'equipment-cms.html'),
        form: resolve(import.meta.dirname, 'form.html'),
        gallery: resolve(import.meta.dirname, 'gallery.html'),
        homeEcommerce: resolve(import.meta.dirname, 'home-ecommerce.html'),
        productEyeGel: resolve(import.meta.dirname, 'product-eye-gel.html'),
        productFaceOil: resolve(import.meta.dirname, 'product-face-oil.html'),
        products: resolve(import.meta.dirname, 'products.html'),
        productsTypes: resolve(import.meta.dirname, 'products-types.html'),
        reviewTestimonial: resolve(import.meta.dirname, 'review-testimonial.html'),
        reviews: resolve(import.meta.dirname, 'reviews.html'),
        samplePage: resolve(import.meta.dirname, 'sample-page.html'),
        serviceDermalFillers: resolve(import.meta.dirname, 'service-dermal-fillers.html'),
        serviceHairStyling: resolve(import.meta.dirname, 'service-hair-styling.html'),
        serviceMakeupApplication: resolve(import.meta.dirname, 'service-makeup-application.html'),
        serviceManicuresAndPedicures: resolve(import.meta.dirname, 'service-manicures-and-pedicures.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        socialFacebook: resolve(import.meta.dirname, 'social-facebook.html'),
        topicTeam: resolve(import.meta.dirname, 'topic-team.html'),
        treatmentFace: resolve(import.meta.dirname, 'treatment-face.html'),
        treatments: resolve(import.meta.dirname, 'treatments.html'),
        typeFaceCare: resolve(import.meta.dirname, 'type-face-care.html'),
      }
    }
  }
});
