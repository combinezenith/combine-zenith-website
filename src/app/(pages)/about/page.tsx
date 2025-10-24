// import Header from '@/app/components/Header';
import AboutStory from '../components/AboutStory';
import CoreValues from '../components/CoreValues';
import AboutTeam from '../components/AboutTeam';
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
