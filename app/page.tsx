import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import StepsSection from '@/components/landing/StepsSection';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <Header />
      <HeroSection />
      <StepsSection />
    </main>
  );
}