import LenisProvider from "@/components/LenisProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Products from "@/components/Products";
import Subscription from "@/components/Subscription";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <LenisProvider />
      <Navbar />
      <Hero />
      <SocialProof />
      <Products />
      <Subscription />
      <Footer />
    </>
  );
}
