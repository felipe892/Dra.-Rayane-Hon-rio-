export const site = {
  brandName: "Dra. Rayane Honório",
  legalName: "Instituto de Estética Especializada Dra. Rayane Honório",
  alternateName: "RB Estética Especializada",
  tagline: "Harmonização Facial",
  city: "Brasília",
  phoneDisplay: "(61) 97401-9864",
  whatsappNumber: "5561974019864",
  instagramHandle: "dra.rayane_rbestetica",
  instagramUrl: "https://www.instagram.com/dra.rayane_rbestetica",
  address: {
    street: "SHJB 3 E/Q 9/10 Bloco E sala 211, Av. Jardim Botânico, 3",
    city: "Brasília",
    state: "DF",
    zip: "71681-525",
    full: "SHJB 3 E/Q 9/10 Bloco E sala 211, Av. Jardim Botânico, 3, Brasília - DF, 71681-525",
  },
  googleRating: 5.0,
  googleReviewCount: 7,
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
