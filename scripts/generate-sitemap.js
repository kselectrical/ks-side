import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.kselectrical.in';

const staticRoutes = [
  '/',
  '/services',
  '/about',
  '/contact',
  '/faq',
  '/privacy-policy',
  '/terms-and-cond'
];

const serviceRoutes = [
  '/services/ac-service',
  '/services/ro-service',
  '/services/electrician-service',
  '/services/washing-machine-repair',
  '/services/refrigerator-repair',
  '/services/chimney-service'
];

const localLandingRoutes = [
  '/ac-service-gaur-city-1',
  '/ac-service-gaur-city-2',
  '/ac-service-noida-extension',
  '/ac-service-greater-noida-west',
  '/ro-service-gaur-city-1',
  '/ro-service-gaur-city-2',
  '/ro-service-noida-extension',
  '/electrician-gaur-city-1',
  '/electrician-gaur-city-2',
  '/electrician-noida-extension',
  '/washing-machine-repair-gaur-city-1',
  '/refrigerator-repair-gaur-city-1',
  '/chimney-service-gaur-city-1'
];

function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add service category routes
  serviceRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
    xml += '  </url>\n';
  });

  // Add local landing routes
  localLandingRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.85</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  const distDir = path.join(__dirname, '../dist');
  
  // Make sure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`Sitemap generated successfully at ${sitemapPath}!`);

  // Generate 404.html routing fallback for GitHub Pages
  const indexPath = path.join(distDir, 'index.html');
  const fallbackPath = path.join(distDir, '404.html');
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, fallbackPath);
    console.log(`Routing fallback 404.html generated successfully at ${fallbackPath}!`);
  } else {
    console.warn(`Warning: index.html not found at ${indexPath}. Could not generate 404.html.`);
  }
}

generateSitemap();
