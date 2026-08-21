import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Products } from "@/components/Products";
import { Repairs } from "@/components/Repairs";
import { Reviews } from "@/components/Reviews";
import { Manifesto } from "@/components/Manifesto";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main data-testid="home-page">
      <Nav />
      <Hero />
      <Marquee />
      <Products />
      <Repairs />
      <Reviews />
      <Manifesto />
      <BeforeAfter />
      <Contact />
      <Footer />
    </main>
  );
}