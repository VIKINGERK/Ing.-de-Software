import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StepsSection from '@/components/StepsSection';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <Header />
      <HeroSection />
      <StepsSection />
    </main>
  );
}