'use client';

import { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 px-16 bg-black relative">
      {/* Purple gradient background */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-2">
        <div className="text-center mb-16 fade-up opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">About Me</h2>
          <div className="w-20 h-1 bg-[#8b5cf6] mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 gap-12 items-center mb-16">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <h3 className="font-serif text-3xl font-bold text-white mb-6">
              Passionate Graphic Designer & Visual Artist from Kampala, Uganda
            </h3>
            <p className="text-[rgba(245,240,235,0.8)] leading-relaxed mb-6">
              I'm a dedicated graphic designer and visual artist with a passion for creating stunning 
              visual experiences through brand identity, print design, and digital art. With 4+ years 
              of experience in the creative industry, I bring fresh perspectives and innovative solutions 
              to every project.
            </p>
            <p className="text-[rgba(245,240,235,0.8)] leading-relaxed">
              I believe that great design is about more than aesthetics – it's about telling stories, 
              building brands, and creating meaningful connections between brands and their audiences 
              through compelling visual communication.
            </p>
          </div>

          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700" style={{transitionDelay: '0.2s'}}>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#141414] border border-[rgba(139,92,246,0.2)] p-6 text-center hover:border-[#8b5cf6] transition-all duration-300">
                <div className="font-serif text-5xl font-bold text-[#8b5cf6] mb-2">4+</div>
                <div className="font-mono text-xs tracking-widest uppercase text-[#888]">Years Experience</div>
              </div>
              <div className="bg-[#141414] border border-[rgba(139,92,246,0.2)] p-6 text-center hover:border-[#8b5cf6] transition-all duration-300">
                <div className="font-serif text-5xl font-bold text-[#8b5cf6] mb-2">50+</div>
                <div className="font-mono text-xs tracking-widest uppercase text-[#888]">Projects Completed</div>
              </div>
              <div className="bg-[#141414] border border-[rgba(139,92,246,0.2)] p-6 text-center hover:border-[#8b5cf6] transition-all duration-300">
                <div className="font-serif text-5xl font-bold text-[#8b5cf6] mb-2">30+</div>
                <div className="font-mono text-xs tracking-widest uppercase text-[#888]">Happy Clients</div>
              </div>
              <div className="bg-[#141414] border border-[rgba(139,92,246,0.2)] p-6 text-center hover:border-[#8b5cf6] transition-all duration-300">
                <div className="font-serif text-5xl font-bold text-[#8b5cf6] mb-2">100%</div>
                <div className="font-mono text-xs tracking-widest uppercase text-[#888]">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}