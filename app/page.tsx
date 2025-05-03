import { Suspense } from "react";
import { Footer, Header, Hero, MainSection } from "@/components/custom";

export default function Home() {
  return (
    <div className="w-full min-h-screen max-w-[1550px] mx-auto">
      <Suspense>
        <Header />
        <Hero />
        <MainSection />
        <Footer />
      </Suspense>
    </div>
  );
}
