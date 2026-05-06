'use client';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import PhotoshopPortfolio from '@/components/PhotoshopPortfolio';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <Marquee />
      <Skills />
      <Experience />
      <PhotoshopPortfolio />
      <Contact />
      <Footer />
      <LanguageSelector />
    </div>
  );
}
