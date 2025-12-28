import { Helmet } from "react-helmet-async";
import { COMPANY_INFO } from "@/lib/content";
import { SERVICE_AREAS } from "@/lib/content";

export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: COMPANY_INFO.name,
    url: "https://cornerstonelawtexas.com",
    telephone: COMPANY_INFO.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.address.street,
      addressLocality: COMPANY_INFO.address.city,
      addressRegion: COMPANY_INFO.address.state,
      postalCode: COMPANY_INFO.address.zip,
      addressCountry: "US",
    },
    areaServed: SERVICE_AREAS,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "09:00",
        closes: "15:00",
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

