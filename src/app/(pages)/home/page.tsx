// import Header from '@/app/components/Header';
import HeroSection from '@/app/components/HeroSection';
import ServicesSection from '@/app/components/ServicesSection';
import AboutSection from './components/AboutSection';
import CTASection from '@/app/components/CTASection'
// import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <Header /> */}
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <CTASection />
      {/* <Footer /> */}
    </main>
  );
}
