import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionTransition from "@/components/SectionTransition";
import About from "@/components/About";
import FacialConcept from "@/components/FacialConcept";
import Procedures from "@/components/Procedures";
import Location from "@/components/Location";
import InstagramCta from "@/components/InstagramCta";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <SectionTransition />
        <About />
        <FacialConcept />
        <Procedures />
        <Location />
        <InstagramCta />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
