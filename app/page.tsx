import { Footer, Header, Hero, MainSection } from "@/components/custom";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <Hero />

      <MainSection />

      <Footer />
    </div>
  );
}
