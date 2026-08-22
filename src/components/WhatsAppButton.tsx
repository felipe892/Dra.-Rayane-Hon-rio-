import { site, whatsappLink } from "@/lib/site";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Olá! Vi o site e gostaria de agendar uma avaliação.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp com ${site.brandName}`}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-ink/20 transition-transform hover:-translate-y-0.5 sm:bottom-8 sm:right-8"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 [animation-duration:0.5s] [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:[animation-name:icon-squish]"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.11.11-1.79-.11a16.5 16.5 0 0 1-1.62-.6c-2.86-1.24-4.72-4.12-4.86-4.31-.14-.19-1.16-1.54-1.16-2.95 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.26.14.44.2.5.32.07.11.07.65-.17 1.33Z" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">
        Agendar no WhatsApp
      </span>
    </a>
  );
}
