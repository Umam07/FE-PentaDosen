import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export default function SEO({
  title = "PentaDosen 2.0 - Platform Portofolio & Tri Dharma Dosen Universitas YARSI",
  description = "PentaDosen 2.0 adalah platform sistem informasi manajemen portofolio dan Tri Dharma Dosen Universitas YARSI. Otomatisasi sinkronisasi data publikasi Google Scholar & Scopus, penelitian, pengabdian, HKI, dan evaluasi kinerja akademik dosen.",
  keywords = "PentaDosen, Penta Dosen, Universitas YARSI, Dosen YARSI, Tri Dharma Dosen, Google Scholar, Scopus, Portofolio Dosen, Publikasi Dosen, Penelitian Dosen, HKI, LPPM YARSI",
  canonical = "https://www.pentadosen.site/",
  ogImage = "https://www.pentadosen.site/PentaDosen-2-0-07-06-2026_05_02_PM.webp"
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMeta = (selector: string, attr: string, content: string) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attr, content);
      } else {
        element = document.createElement('meta');
        const [key, value] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(key, value.replace(/"/g, ''));
        element.setAttribute(attr, content);
        document.head.appendChild(element);
      }
    };

    // 2. Update Primary Meta Tags
    updateMeta('meta[name="title"]', 'content', title);
    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('meta[name="keywords"]', 'content', keywords);

    // 3. Update Open Graph Tags
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:url"]', 'content', canonical);
    updateMeta('meta[property="og:image"]', 'content', ogImage);

    // 4. Update Twitter Card Tags
    updateMeta('meta[property="twitter:title"]', 'content', title);
    updateMeta('meta[property="twitter:description"]', 'content', description);
    updateMeta('meta[property="twitter:url"]', 'content', canonical);
    updateMeta('meta[property="twitter:image"]', 'content', ogImage);

    // 5. Update Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonical);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonical);
      document.head.appendChild(linkCanonical);
    }
  }, [title, description, keywords, canonical, ogImage]);

  return null;
}
