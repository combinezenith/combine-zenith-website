import HeroSection from '@/app//(components)/HeroSection';
// import ServicesSection from '@/app/(components)/ServicesSection';
import AboutSection from '@/app/(components)/AboutSection';
import CTASection from '@/app/(components)/CTASection';


export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      {/* <ServicesSection /> */}
      <AboutSection />
      <CTASection />
    </main>
  );
}
