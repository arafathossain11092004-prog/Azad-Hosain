import { SmoothScroll } from '../components/SmoothScroll';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ShortsReels } from '../components/ShortsReels';
import { ProjectGrid } from '../components/ProjectGrid';
import { Services } from '../components/Services';
import { Pricing } from '../components/Pricing';
import { About } from '../components/About';
import { Contact } from '../components/Contact';

export default function Home() {
  return (
    <SmoothScroll>
      <main className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-red-500/30 selection:text-white overflow-x-hidden">
        <Navbar />
        <Hero />
        <ShortsReels />
        <ProjectGrid />
        <Services />
        <Pricing />
        <About />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
