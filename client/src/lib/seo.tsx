import { Helmet } from "react-helmet-async";

const SITE_ORIGIN = import.meta.env.VITE_SITE_ORIGIN || "https://cornerstone-law-group.replit.app";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/opengraph.jpg`;

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
}

export function SEO({ title, description, path, ogImage = DEFAULT_OG_IMAGE, noindex = false }: SEOProps) {
  const canonical = `${SITE_ORIGIN}${path}`;
  const fullTitle = `${title} | Cornerstone Law Group, P.C.`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}

