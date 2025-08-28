import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/story/'],
    },
    sitemap: 'https://whathappen.org/sitemap.xml',
  }
}
