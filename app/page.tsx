import { Suspense } from "react";
import { Footer, Header, Hero, MainSection } from "@/components/custom";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Suspense>
        <Header />
        <Hero />
        <MainSection />
        <Footer />
      </Suspense>
    </div>
  );
}
