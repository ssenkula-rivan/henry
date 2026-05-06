'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Portfolio() {
  const { t } = useLanguage();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.portfolio-card').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const portfolioItems = [
    { 
      image: '/images/projects/photoshop/WEB1.jpg',
      title: 'Digital Art Composition', 
      tools: 'Photoshop · Digital Art', 
      category: 'Digital Illustration',
      description: 'Advanced digital composition showcasing photo manipulation and artistic techniques'
    },
    { 
      image: '/images/projects/photoshop/WEB1-2.jpg',
      title: 'Photo Retouching', 
      tools: 'Photoshop · Photo Editing', 
      category: 'Photo Editing',
      description: 'Professional photo retouching and enhancement demonstrating advanced editing skills'
    },
    { 
      image: '/images/projects/photoshop/WEB1-3.jpg',
      title: 'Brand Visual Design', 
      tools: 'Photoshop · Branding', 
      category: 'Brand Identity',
      description: 'Creative brand visual design with modern aesthetics and professional composition'
    },
    { 
      image: '/images/projects/photoshop/WEB1-4.jpg',
      title: 'Creative Composition', 
      tools: 'Photoshop · Digital Art', 
      category: 'Digital Art',
      description: 'Innovative digital composition blending multiple elements seamlessly'
    },
    { 
      image: '/images/projects/photoshop/web1-5.jpg',
      title: 'Marketing Visual', 
      tools: 'Photoshop · Marketing', 
      category: 'Marketing Design',
      description: 'Professional marketing visual designed for promotional campaigns'
    },
    { 
      image: '/images/projects/photoshop/WEB 6.jpg',
      title: 'Artistic Portrait', 
      tools: 'Photoshop · Portrait', 
      category: 'Portrait Photography',
      description: 'Artistic portrait editing with advanced color grading and effects'
    },
    { 
      image: '/images/projects/photoshop/WEB 7.jpg',
      title: 'Creative Design', 
      tools: 'Photoshop · Creative', 
      category: 'Creative Design',
      description: 'Creative design project showcasing advanced Photoshop techniques'
    },
    { 
      image: '/images/projects/photoshop/WEB 8.jpg',
      title: 'Visual Storytelling', 
      tools: 'Photoshop · Storytelling', 
      category: 'Digital Art',
      description: 'Visual storytelling through compelling digital imagery'
    },
    { 
      image: '/images/projects/photoshop/WEB 9.jpg',
      title: 'Professional Editing', 
      tools: 'Photoshop · Professional', 
      category: 'Photo Editing',
      description: 'Professional photo editing with attention to detail and quality'
    },
  ];

  return (
    <section id="portfolio" className="px-16 py-24 bg-[#141414]">
      <div className="section-tag font-mono text-xs tracking-[0.3em] uppercase text-[#e8c84a] mb-2">{t('portfolio.selected')}</div>
      <h2 className="section-heading font-serif text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1.1] mb-4">{t('portfolio.title')}</h2>
      <p className="section-sub text-[#888] text-base leading-relaxed max-w-[540px] mb-3">
        {t('portfolio.description')}
      </p>
      <div className="divider w-16 h-0.5 bg-[#e8c84a] mb-12"></div>
      
      <div className="portfolio-grid grid grid-cols-3 gap-6 mt-12">
        {portfolioItems.map((item, index) => (
          <div 
            key={index}
            className="portfolio-card border border-[rgba(232,200,74,0.18)] overflow-hidden relative aspect-[4/3] cursor-pointer transition-all duration-300 hover:scale-[0.98] hover:border-[#e8c84a] group fade-up opacity-0 translate-y-8"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            {/* Project Image */}
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.9)] via-transparent to-transparent opacity-60"></div>
            
            {/* Project Info Overlay */}
            <div className="portfolio-overlay absolute inset-0 bg-[rgba(10,10,10,0.85)] flex flex-col justify-end p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="space-y-2">
                <span className="text-[#e8c84a] font-mono text-xs tracking-[0.1em] uppercase">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] text-sm leading-relaxed mb-2">
                  {item.description}
                </p>
                <p className="text-[#e8c84a] font-mono text-xs tracking-[0.1em] uppercase">
                  {item.tools}
                </p>
              </div>
            </div>
            
            {/* Quick View Badge */}
            <div className="absolute top-4 right-4 bg-[#e8c84a] text-black px-2 py-1 font-mono text-xs tracking-widest uppercase font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              View
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
