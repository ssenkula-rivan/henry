'use client';

import { useEffect } from 'react';

export default function Hero() {
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

  const technologies = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Git'
  ];

  return (
    <section id="home" className="hero min-h-screen grid grid-cols-2 items-center px-16 py-32 relative bg-black">
      {/* Purple gradient background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="hero-text relative z-2 fade-up opacity-0 translate-y-8 transition-all duration-700">
        <div className="hero-tag font-mono text-xs tracking-[0.25em] uppercase text-[#8b5cf6] mb-6 flex items-center gap-3">
          <span className="inline-block w-[30px] h-[1px] bg-[#8b5cf6]"></span>
          Available for Work
        </div>
        
        <h1 className="hero-name font-serif text-[clamp(3.5rem,7vw,6rem)] font-black leading-[0.95] tracking-[-0.02em] mb-4">
          <span className="first text-white">Mbalire</span><br />
          <span className="last text-transparent [-webkit-text-stroke:2px_#8b5cf6]">Henry</span>
        </h1>
        
        <h2 className="hero-title text-2xl font-medium text-[rgba(245,240,235,0.9)] mb-6">
          Web Developer & UI/UX Designer
        </h2>
        
        <p className="hero-bio text-base leading-relaxed text-[rgba(245,240,235,0.7)] max-w-[500px] mb-8">
          I create beautiful, responsive, and user-friendly websites that help businesses grow. 
          With expertise in modern web technologies, I turn ideas into reality.
        </p>
        
        <div className="hero-cta flex gap-4 items-center mb-10">
          <a href="#projects" className="bg-[#8b5cf6] text-black px-8 py-3 font-mono text-xs tracking-widest uppercase font-bold no-underline hover:bg-[#7c3aed] transition-all duration-200">
            View My Work
          </a>
          <a href="#contact" className="border border-[rgba(245,240,235,0.3)] text-white px-8 py-3 font-mono text-xs tracking-widest uppercase no-underline hover:border-[#8b5cf6] hover:text-[#8b5cf6] transition-all duration-200">
            Download CV
          </a>
        </div>
        
        <div className="technologies-section">
          <h3 className="font-mono text-xs tracking-[0.12em] uppercase text-[#888] mb-4">Technologies I work with:</h3>
          <div className="technologies-list flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <span key={index} className="tech-item bg-[#141414] border border-[rgba(139,92,246,0.3)] text-[#8b5cf6] px-4 py-2 font-mono text-xs tracking-wider uppercase hover:bg-[#8b5cf6] hover:text-black transition-all duration-200 cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-photo-wrap flex justify-center items-center relative z-2 fade-up opacity-0 translate-y-8 transition-all duration-700" style={{transitionDelay: '0.2s'}}>
        <div className="photo-frame relative w-[380px] h-[460px]">
          {/* Frame border */}
          <div className="absolute inset-[-12px] border-2 border-[#8b5cf6] rotate-3 opacity-50"></div>
          
          {/* DEVELOPER text watermark */}
          <div className="absolute bottom-[-2rem] right-[-3rem] font-serif text-20xl font-black text-transparent [-webkit-text-stroke:1px_rgba(139,92,246,0.2)] pointer-events-none z-[-1]">
            DEVELOPER
          </div>
          
          {/* Photo with fallback */}
          <img 
            src="/MIbB4.jpg.jpeg" 
            alt="Mbalire Henry — Web Developer" 
            className="w-full h-full object-cover object-center-top block filter grayscale-[20%] contrast-[1.05]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#1a1206] to-[#2d2310] flex items-center justify-center relative overflow-hidden"><div class="absolute inset-0 bg-black/20"></div><span class="relative text-white/50 font-serif text-4xl">PHOTO</span></div>';
            }}
          />
          
          {/* Photo badge */}
          <div className="absolute bottom-[-1.5rem] left-[-1.5rem] bg-[#8b5cf6] text-black p-4 font-mono text-xs tracking-widest uppercase font-bold leading-6">
            Web<br />Developer<br />— Kampala, UG
          </div>
        </div>
      </div>
    </section>
  );
}
