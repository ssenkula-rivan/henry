'use client';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Blog from '@/components/Blog';
import CTA from '@/components/CTA';
import Testimonial from '@/components/Testimonial';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Blog />
      <CTA />
      <Testimonial />
      <Footer />
    </div>
  );
}
