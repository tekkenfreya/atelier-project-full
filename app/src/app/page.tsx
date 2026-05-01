import LenisProvider from "@/components/LenisProvider";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Products from "@/components/Products";
import Subscription from "@/components/Subscription";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="atelier">
      <LenisProvider />
      <Hero />
      <Products />
      <SocialProof />
      <Subscription />
      <Footer />
    </div>
  );
}
