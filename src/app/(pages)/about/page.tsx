// import Header from '@/app/components/Header';
import AboutStory from '@/app/(components)/AboutStory';
import CoreValues from '@/app/(components)/CoreValues';
import AboutTeam from '@/app/(components)/AboutTeam';
// import Footer from '@/app/components/Footer';

export default function About() {
  return (
    <main className="min-h-screen">
        {/* <Header /> */}
        <AboutStory />
        <CoreValues />
        <AboutTeam />
        {/* <Footer /> */}
    </main>
  );
}
