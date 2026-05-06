'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Experience() {
  const { t } = useLanguage();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      year: '2022 — Present',
      role: 'Senior Graphic Designer',
      company: 'Freelance / Independent Studio — Kampala, Uganda',
      description: 'Leading visual identity projects for brands across East Africa. Specializing in brand systems, print collateral, and digital design. Delivering end-to-end creative solutions from strategy through execution.'
    },
    {
      year: '2020 — 2022',
      role: 'Graphic Designer',
      company: 'Creative Agency — Kampala, Uganda',
      description: 'Designed marketing materials, social media campaigns, and brand identities for clients in retail, hospitality, and finance. Collaborated with cross-functional teams to deliver print and digital assets on deadline.'
    },
    {
      year: '2019 — 2020',
      role: 'Junior Designer',
      company: 'Design Studio — Uganda',
      description: 'Supported senior designers in producing logos, brochures, and exhibition materials. Developed foundational skills in typography, layout, and client communication.'
    }
  ];

  return (
    <section id="experience" className="px-16 py-24">
      <div className="section-tag font-mono text-xs tracking-[0.3em] uppercase text-[#e8c84a] mb-2">{t('experience.timeline')}</div>
      <h2 className="section-heading font-serif text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1.1] mb-4">{t('experience.title')}</h2>
      <div className="divider w-16 h-0.5 bg-[#e8c84a] mb-12"></div>
      
      <div className="timeline mt-12">
        {experiences.map((exp, index) => (
          <div 
            key={index}
            className="timeline-item grid grid-cols-[140px_1fr] gap-8 py-8 border-b border-[rgba(232,200,74,0.18)] relative fade-up opacity-0 translate-y-8 transition-all duration-700"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className="timeline-year font-mono text-xs text-[#e8c84a] tracking-[0.12em] pt-0.5">
              {exp.year}
            </div>
            <div>
              <div className="timeline-role font-serif text-xl font-bold mb-1">
                {exp.role}
              </div>
              <div className="timeline-company font-mono text-xs tracking-[0.12em] uppercase text-[#e8c84a] mb-3">
                {exp.company}
              </div>
              <div className="timeline-desc text-[rgba(245,240,235,0.6)] text-sm leading-relaxed">
                {exp.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
