import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: string;
  image?: string;
  url?: string;
  schema?: Record<string, any>;
}

export function SEO({
  title = 'Ghazal Dental Store | غزال دنتل ستور',
  description = 'متجر غزال دنتل لبيع مستلزمات طب الأسنان بالعريش. تجهيزات متكاملة لطلاب طب أسنان جامعة سيناء وعيادات الأسنان.',
  keywords = 'غزال, Ghazal, غزال دنتل, Ghazal Dental, أدوات أسنان في العريش, مستلزمات طب أسنان',
  type = 'website',
  image = 'https://ghazaldental.com/logo.png', // Replace with real URL later
  url = 'https://ghazaldental.com',
  schema,
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Structured Data (Schema.org) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
