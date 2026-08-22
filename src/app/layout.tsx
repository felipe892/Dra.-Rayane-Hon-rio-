import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://drarayanehonorio.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dra. Rayane Honório | Harmonização Facial em Brasília",
  description:
    "Instituto de Estética Especializada Dra. Rayane Honório — harmonização facial em Brasília. Agende sua avaliação pelo WhatsApp.",
  keywords: [
    "harmonização facial Brasília",
    "harmonização facial",
    "preenchimento labial",
    "perfiloplastia",
    "contorno facial",
    "Dra. Rayane Honório",
    "estética facial Brasília",
  ],
  openGraph: {
    title: "Dra. Rayane Honório | Harmonização Facial em Brasília",
    description:
      "Instituto de Estética Especializada Dra. Rayane Honório — harmonização facial em Brasília.",
    url: siteUrl,
    siteName: "Dra. Rayane Honório",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/dra-rayane-portrait-1.jpg",
        width: 1200,
        height: 1500,
        alt: "Dra. Rayane Honório",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dra. Rayane Honório | Harmonização Facial em Brasília",
    description:
      "Instituto de Estética Especializada Dra. Rayane Honório — harmonização facial em Brasília.",
    images: ["/images/dra-rayane-portrait-1.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
