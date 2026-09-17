'use client';

import { useEffect } from 'react';

export default function CTA() {
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
    <section className="py-24 px-16 bg-black relative overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(139,92,246,0.1)] to-[rgba(124,58,237,0.05)]"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-2 fade-up opacity-0 translate-y-8 transition-all duration-700">
        <h2 className="font-serif text-5xl font-bold text-white mb-6">
          Let's Work Together
        </h2>
        <p className="text-xl text-[rgba(245,240,235,0.8)] mb-10 max-w-2xl mx-auto">
          I'm always interested in hearing about new projects and opportunities. 
          Whether you have a question or just want to say hi, feel free to reach out!
        </p>
        <a 
          href="#contact" 
          className="inline-block bg-[#8b5cf6] text-black px-10 py-4 font-mono text-sm tracking-widest uppercase font-bold no-underline hover:bg-[#7c3aed] hover:-translate-y-1 transition-all duration-300"
        >
          Get In Touch
        </a>
      </div>
    </section>
  );
}