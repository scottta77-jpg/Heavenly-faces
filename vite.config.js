import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5175,
  },
  plugins: [
    {
      name: 'clean-urls-and-routes',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const [urlPath, query] = req.url.split('?');
            const qStr = query ? `?${query}` : '';
            if (urlPath === '/categories-1') {
              req.url = `/categories-1.html${qStr}`;
            } else if (urlPath === '/about-1') {
              req.url = `/about-1.html${qStr}`;
            } else if (urlPath === '/contact-1') {
              req.url = `/contact-1.html${qStr}`;
            } else if (urlPath === '/services') {
              req.url = `/services.html${qStr}`;
            } else if (urlPath === '/products') {
              req.url = `/products.html${qStr}`;
            } else if (urlPath === '/products-types') {
              req.url = `/products-types.html${qStr}`;
            } else if (urlPath === '/treatments') {
              req.url = `/treatments.html${qStr}`;
            } else if (urlPath === '/reviews') {
              req.url = `/reviews.html${qStr}`;
            } else if (urlPath === '/blog') {
              req.url = `/blog.html${qStr}`;
            } else if (urlPath === '/gallery') {
              req.url = `/gallery.html${qStr}`;
            } else if (urlPath === '/form') {
              req.url = `/form.html${qStr}`;
            } else if (urlPath.startsWith('/category/')) {
              const cat = urlPath.replace('/category/', '');
              req.url = `/category-${cat}.html${qStr}`;
            } else if (urlPath.startsWith('/service/')) {
              const serv = urlPath.replace('/service/', '');
              req.url = `/service-${serv}.html${qStr}`;
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        about1: resolve(__dirname, 'about-1.html'),
        blankPage: resolve(__dirname, 'blank-page.html'),
        blogArticle: resolve(__dirname, 'blog-article.html'),
        blogTopics: resolve(__dirname, 'blog-topics.html'),
        blog: resolve(__dirname, 'blog.html'),
        categories: resolve(__dirname, 'categories.html'),
        categories1: resolve(__dirname, 'categories-1.html'),
        categorySkincare: resolve(__dirname, 'category-skincare.html'),
        categoryHairBody: resolve(__dirname, 'category-hair-body.html'),
        categoryMakeUp: resolve(__dirname, 'category-make-up.html'),
        categoryBeauty: resolve(__dirname, 'category-beauty.html'),
        contact: resolve(__dirname, 'contact.html'),
        contact1: resolve(__dirname, 'contact-1.html'),
        equipmentCms: resolve(__dirname, 'equipment-cms.html'),
        form: resolve(__dirname, 'form.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        homeEcommerce: resolve(__dirname, 'home-ecommerce.html'),
        productEyeGel: resolve(__dirname, 'product-eye-gel.html'),
        productFaceOil: resolve(__dirname, 'product-face-oil.html'),
        products: resolve(__dirname, 'products.html'),
        productsTypes: resolve(__dirname, 'products-types.html'),
        reviewTestimonial: resolve(__dirname, 'review-testimonial.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        samplePage: resolve(__dirname, 'sample-page.html'),
        serviceDermalFillers: resolve(__dirname, 'service-dermal-fillers.html'),
        serviceHairStyling: resolve(__dirname, 'service-hair-styling.html'),
        serviceMakeupApplication: resolve(__dirname, 'service-makeup-application.html'),
        serviceManicuresAndPedicures: resolve(__dirname, 'service-manicures-and-pedicures.html'),
        services: resolve(__dirname, 'services.html'),
        socialFacebook: resolve(__dirname, 'social-facebook.html'),
        topicTeam: resolve(__dirname, 'topic-team.html'),
        treatmentFace: resolve(__dirname, 'treatment-face.html'),
        treatments: resolve(__dirname, 'treatments.html'),
        typeFaceCare: resolve(__dirname, 'type-face-care.html'),
      }
    }
  }
});
