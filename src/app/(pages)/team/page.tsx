// import Header from '@/app/components/Header';
import TeamHero from '@/app/(components)/TeamHero'
import TeamCard from '@/app/(components)/TeamCard';
import TeamCTA from '@/app/(components)/TeamCTA';
// import Footer from '@/app/components/Footer';

export default function Team() {
  return (
    <main className="min-h-screen">
        {/* <Header /> */}
        <TeamHero />
        <TeamCard />
        <TeamCTA />
        {/* <Footer /> */}
    </main>
  );
}
