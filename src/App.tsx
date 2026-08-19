import { useState } from "react";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Capabilities } from "@/components/landing/capabilities";
import { Moments } from "@/components/landing/moments";
import { ForHotels } from "@/components/landing/for-hotels";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function App() {
  const [talking, setTalking] = useState(false);

  const openTalk = () => {
    setTalking(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-bg text-fg">
      <Nav onTalk={openTalk} />
      <Hero talking={talking} onTalkChange={setTalking} />
      <HowItWorks />
      <Capabilities />
      <Moments />
      <ForHotels />
      <Cta onTalk={openTalk} />
      <Footer />
    </main>
  );
}
