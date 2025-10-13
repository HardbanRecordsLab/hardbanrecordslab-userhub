import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export function SEO({
  title = "HardbanRecords Lab",
  description = "Kompleksowa platforma dla niezależnych artystów i wydawców muzycznych. Zarządzaj dystrybucją, promocją i sprzedażą w jednym miejscu.",
  keywords = "dystrybucja muzyki, promocja muzyki, niezależni artyści, wydawnictwo muzyczne, RouteNote, marketing muzyczny",
  ogImage = "/og-image.jpg",
  ogType = "website",
}: SEOProps) {
  const fullTitle = title === "HardbanRecords Lab" ? title : `${title} | HardbanRecords Lab`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
