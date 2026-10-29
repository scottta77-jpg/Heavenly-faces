import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        blankPage: resolve(__dirname, 'blank-page.html'),
        blogArticle: resolve(__dirname, 'blog-article.html'),
        blogTopics: resolve(__dirname, 'blog-topics.html'),
        blog: resolve(__dirname, 'blog.html'),
        categories: resolve(__dirname, 'categories.html'),
        contact: resolve(__dirname, 'contact.html'),
        equipmentCms: resolve(__dirname, 'equipment-cms.html'),
        form: resolve(__dirname, 'form.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        homeEcommerce: resolve(__dirname, 'home-ecommerce.html'),
        productEyeGel: resolve(__dirname, 'product-eye-gel.html'),
        productFaceOil: resolve(__dirname, 'product-face-oil.html'),
        productsTypes: resolve(__dirname, 'products-types.html'),
        reviewTestimonial: resolve(__dirname, 'review-testimonial.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        samplePage: resolve(__dirname, 'sample-page.html'),
        serviceDermalFillers: resolve(__dirname, 'service-dermal-fillers.html'),
        serviceHairStyling: resolve(__dirname, 'service-hair-styling.html'),
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
