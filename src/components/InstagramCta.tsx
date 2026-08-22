import Image from "next/image";
import { site } from "@/lib/site";
import RevealImage from "./motion/RevealImage";
import MagneticButton from "./motion/MagneticButton";

export default function InstagramCta() {
  return (
    <section className="bg-cream py-28 text-ink md:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12">
        <div className="min-w-0 md:col-span-5">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-dark">
            05 &nbsp;/&nbsp; Instagram
          </span>

          <Image
            src="/images/instagram-logo-gold.png"
            alt=""
            width={80}
            height={80}
            unoptimized
            className="mt-4 h-10 w-10"
          />

          <h2 className="mt-3 break-words font-serif text-3xl leading-[1.15] sm:text-4xl">
            @{site.instagramHandle}
          </h2>
          <p className="mt-6 max-w-sm text-ink/70">
            Acompanhe o dia a dia da clínica, bastidores e novidades sobre
            harmonização facial.
          </p>
          <div className="mt-8">
            <MagneticButton href={site.instagramUrl} external variant="outline" arrow>
              Seguir no Instagram
            </MagneticButton>
          </div>
        </div>

        <div className="md:col-span-7">
          <RevealImage
            src="/images/dra-rayane-fullbody.webp"
            alt={site.brandName}
            fill
            sizes="(min-width: 768px) 55vw, 90vw"
            wrapperClassName="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden md:max-w-none"
            className="object-cover [object-position:50%_15%]"
          />
        </div>
      </div>
    </section>
  );
}
