'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdobePhotoshopIcon from '@/components/AdobePhotoshopIcon';
import AdobeIllustratorIcon from '@/components/AdobeIllustratorIcon';
import AdobeInDesignIcon from '@/components/AdobeInDesignIcon';
import BlenderIcon from '@/components/BlenderIcon';
import FigmaIcon from '@/components/FigmaIcon';
import { BrandIcon } from '@/components/SkillIcons';

export default function Skills() {
  const { t } = useLanguage();
  
  useEffect(() => {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as Element).querySelectorAll('.skill-level-fill').forEach(bar => {
            const barElement = bar as HTMLElement;
            const w = barElement.getAttribute('data-width');
            barElement.style.width = '0%';
            setTimeout(() => { 
              if (w) barElement.style.width = w; 
            }, 200);
          });
        }
      });
    }, { threshold: 0.3 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) skillObs.observe(skillsSection);

    return () => skillObs.disconnect();
  }, []);

  const skills = [
    { icon: <AdobePhotoshopIcon />, name: 'Adobe Photoshop', description: 'Photo editing, digital painting, compositing & retouching', level: 95, category: 'Expert' },
    { icon: <AdobeIllustratorIcon />, name: 'Adobe Illustrator', description: 'Vector art, logo design, illustration & brand systems', level: 90, category: 'Expert' },
    { icon: <AdobeInDesignIcon />, name: 'Adobe InDesign', description: 'Print layouts, publications, brochures & editorial design', level: 88, category: 'Advanced' },
    { icon: <BlenderIcon />, name: 'Blender', description: '3D modeling, rendering, product visualization & animation', level: 75, category: 'Proficient' },
    { icon: <FigmaIcon />, name: 'Figma', description: 'UI/UX design, prototyping, design systems & collaboration', level: 82, category: 'Advanced' },
    { icon: <BrandIcon />, name: 'Brand Identity', description: 'Strategy, visual identity, brand guidelines & systems', level: 92, category: 'Expert' },
  ];

  return (
    <section id="skills" className="px-16 py-24 bg-[#141414]">
      <div className="section-tag font-mono text-xs tracking-[0.3em] uppercase text-[#e8c84a] mb-2">{t('skills.whatIUse')}</div>
      <h2 className="section-heading font-serif text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1.1] mb-4">{t('skills.title')}</h2>
      <div className="divider w-16 h-0.5 bg-[#e8c84a] mb-12"></div>
      
      <div className="skills-grid grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 mt-12">
        {skills.map((skill, index) => (
          <div 
            key={skill.name}
            className="skill-card border border-[rgba(232,200,74,0.18)] p-8 relative transition-all duration-300 overflow-hidden hover:border-[rgba(232,200,74,0.4)] hover:-translate-y-1 fade-up opacity-0 translate-y-8"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            {/* Hover effect top border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#e8c84a] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
            
            <div className="skill-icon text-3xl mb-4">{skill.icon}</div>
            <div className="skill-name font-serif text-xl font-bold mb-2">{skill.name}</div>
            <p className="text-[#888] text-sm mt-2 leading-relaxed">{skill.description}</p>
            
            <div className="skill-level-bar w-full h-0.5 bg-[rgba(255,255,255,0.1)] mt-4 relative">
              <div 
                className="skill-level-fill h-full bg-gradient-to-r from-[#b8981e] to-[#e8c84a] transition-all duration-1000 ease-out"
                data-width={`${skill.level}%`}
              ></div>
            </div>
            <div className="skill-pct font-mono text-xs text-[#e8c84a] tracking-[0.1em] mt-1">
              {t(`skills.${skill.category.toLowerCase()}`)} · {skill.level}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
