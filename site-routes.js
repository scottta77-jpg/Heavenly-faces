// Public URLs follow the names visitors see in the navigation.
// Source filenames stay stable so Webflow page IDs and interactions are preserved.
export const siteRoutes = [
  { path: '/', file: 'index.html' },
  { path: '/categories', file: 'categories-1.html', aliases: ['/categories-1', '/categories.html'] },
  { path: '/services', file: 'services.html' },
  { path: '/shop', file: 'products.html', aliases: ['/products'] },
  { path: '/skin-types', file: 'products-types.html', aliases: ['/products-types'] },
  { path: '/about', file: 'about-1.html', aliases: ['/about-1', '/about.html'] },
  { path: '/contact', file: 'contact-1.html', aliases: ['/contact-1', '/contact.html'] },
  { path: '/gallery', file: 'gallery.html' },
  { path: '/treatments', file: 'treatments.html' },
  { path: '/approach', file: 'reviews.html', aliases: ['/reviews'] },
  { path: '/blog', file: 'blog.html' },
  { path: '/enquire', file: 'form.html', aliases: ['/form'] },
  { path: '/category/skincare', file: 'category-skincare.html' },
  { path: '/category/moisturisers-care', file: 'category-hair-body.html', aliases: ['/category/hair-body'] },
  { path: '/category/serums', file: 'category-make-up.html', aliases: ['/category/make-up'] },
  { path: '/category/cleansing', file: 'category-beauty.html', aliases: ['/category/beauty'] },
  { path: '/service/dermal-fillers', file: 'service-dermal-fillers.html' },
  { path: '/service/skin-boosters', file: 'service-makeup-application.html', aliases: ['/service/makeup-application'] },
  { path: '/service/microneedling', file: 'service-manicures-and-pedicures.html', aliases: ['/service/manicures-and-pedicures'] },
  { path: '/service/chemical-peels', file: 'service-hair-styling.html', aliases: ['/service/hair-styling'] },
];

export const legacyPaths = new Map(siteRoutes.flatMap(route =>
  [`/${route.file}`, ...(route.aliases || [])].map(alias => [alias, route.path])
));

export function canonicalPath(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return legacyPaths.get(path) || path;
}
