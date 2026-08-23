import Image from "next/image";
import { site } from "@/lib/site";

export default function Footer() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: site.legalName,
    alternateName: [site.brandName, site.alternateName],
    image: "/images/logo-gold.png",
    telephone: site.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "BR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.googleRating,
      reviewCount: site.googleReviewCount,
    },
    sameAs: [site.instagramUrl],
  };

  return (
    <footer className="bg-cream-dark py-14 text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <Image
          src="/images/logo-gold.png"
          alt={site.legalName}
          width={160}
          height={160}
          unoptimized
          className="h-16 w-16 object-contain"
        />
        <div>
          <p className="font-serif text-lg">{site.legalName}</p>
          <p className="mt-1 text-sm text-ink/60">{site.address.full}</p>
          <p className="mt-1 text-sm text-ink/60">{site.phoneDisplay}</p>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-dark">
            Instagram
          </a>
          <a href="#top" className="hover:text-gold-dark">
            Voltar ao topo
          </a>
        </div>
        <p className="text-xs text-ink/40">
          © {new Date().getFullYear()} {site.brandName}. Todos os direitos
          reservados.
        </p>
        <p className="flex items-center gap-1.5 text-xs text-ink/40">
          desenvolvido por
          <Image
            src="/images/rabbit-logo.png"
            alt="Rabbit"
            width={80}
            height={22}
            unoptimized
            className="h-4 w-auto object-contain"
          />
        </p>
      </div>
    </footer>
  );
}
