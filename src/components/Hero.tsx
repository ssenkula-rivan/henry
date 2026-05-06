'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import RoleButtons from '@/components/RoleButtons';

export default function Hero() {
  const { t } = useLanguage();

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
    <section className="hero min-h-screen grid grid-cols-2 items-center px-16 py-32 relative bg-black">
      {/* Simple background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(232,200,74,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="hero-text relative z-2 fade-up opacity-0 translate-y-8 transition-all duration-700">
        <div className="hero-tag font-mono text-xs tracking-[0.25em] uppercase text-[#e8c84a] mb-6 flex items-center gap-3">
          <span className="inline-block w-[30px] h-[1px] bg-[#e8c84a]"></span>
          {t('hero.available')}
        </div>
        
        <h1 className="hero-name font-serif text-[clamp(3.5rem,7vw,6rem)] font-black leading-[0.95] tracking-[-0.02em] mb-1">
          <span className="first text-white">Mbalire</span><br />
          <span className="last text-transparent [-webkit-text-stroke:2px_#e8c84a]">Henry</span>
        </h1>
        
        <div className="my-6">
          <RoleButtons />
        </div>
        
        <p className="hero-bio text-base leading-relaxed text-[rgba(245,240,235,0.8)] max-w-[440px] mb-10">
          {t('hero.bio')}
        </p>
        
        <div className="hero-stats flex gap-10 mb-12">
          <div>
            <div className="stat-num font-serif text-5xl font-bold text-[#e8c84a] leading-none">5+</div>
            <div className="stat-label text-xs tracking-[0.12em] uppercase text-[#888] mt-1">{t('hero.years')}</div>
          </div>
          <div>
            <div className="stat-num font-serif text-5xl font-bold text-[#e8c84a] leading-none">60+</div>
            <div className="stat-label text-xs tracking-[0.12em] uppercase text-[#888] mt-1">{t('hero.projects')}</div>
          </div>
          <div>
            <div className="stat-num font-serif text-5xl font-bold text-[#e8c84a] leading-none">30+</div>
            <div className="stat-label text-xs tracking-[0.12em] uppercase text-[#888] mt-1">{t('hero.clients')}</div>
          </div>
        </div>
        
        <div className="hero-cta flex gap-4 items-center">
          <a href="#portfolio" className="bg-[#e8c84a] text-black px-8 py-3 font-mono text-xs tracking-widest uppercase font-bold no-underline hover:bg-[#b8981e] transition-all duration-200">
            {t('hero.viewWork')}
          </a>
          <a href="#contact" className="border border-[rgba(245,240,235,0.3)] text-white px-8 py-3 font-mono text-xs tracking-widest uppercase no-underline hover:border-[#e8c84a] hover:text-[#e8c84a] transition-all duration-200">
            {t('hero.letsTalk')}
          </a>
        </div>
      </div>

      <div className="hero-photo-wrap flex justify-center items-center relative z-2 fade-up opacity-0 translate-y-8 transition-all duration-700" style={{transitionDelay: '0.2s'}}>
        <div className="photo-frame relative w-[380px] h-[460px]">
          {/* Frame border */}
          <div className="absolute inset-[-12px] border-2 border-[#e8c84a] rotate-3 opacity-50"></div>
          
          {/* CREATIVE text watermark */}
          <div className="absolute bottom-[-2rem] right-[-3rem] font-serif text-20xl font-black text-transparent [-webkit-text-stroke:1px_rgba(232,200,74,0.2)] pointer-events-none z-[-1]">
            CREATIVE
          </div>
          
          {/* Photo with fallback */}
          <img 
            src="/MIbB4.jpg.jpeg" 
            alt="Mbalire Henry — Graphic Designer" 
            className="w-full h-full object-cover object-center-top block filter grayscale-[20%] contrast-[1.05]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#1a1206] to-[#2d2310] flex items-center justify-center relative overflow-hidden"><div class="absolute inset-0 bg-black/20"></div><span class="relative text-white/50 font-serif text-4xl">PHOTO</span></div>';
            }}
          />
          
          {/* Photo badge */}
          <div className="absolute bottom-[-1.5rem] left-[-1.5rem] bg-[#e8c84a] text-black p-4 font-mono text-xs tracking-widest uppercase font-bold leading-6">
            Graphic<br />Designer<br />— Kampala, UG
          </div>
        </div>
      </div>
    </section>
  );
}
