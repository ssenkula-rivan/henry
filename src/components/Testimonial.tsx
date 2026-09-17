'use client';

import { useEffect } from 'react';

export default function Testimonial() {
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
    <section className="py-24 px-16 bg-[#141414] relative">
      {/* Purple gradient background */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-2 fade-up opacity-0 translate-y-8 transition-all duration-700">
        <div className="text-6xl text-[#8b5cf6] mb-6">"</div>
        <blockquote className="font-serif text-2xl md:text-3xl text-white leading-relaxed mb-8">
          Mbalire is an exceptional developer who delivered our project on time and exceeded our expectations. 
          His attention to detail and creative problem-solving skills are impressive.
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">
            JD
          </div>
          <div className="text-left">
            <div className="font-serif text-lg font-bold text-white">John Doe</div>
            <div className="font-mono text-xs tracking-widest uppercase text-[#888]">CEO, Tech Startup</div>
          </div>
        </div>
      </div>
    </section>
  );
}