'use client';

import { useEffect } from 'react';

export default function Skills() {
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
    { name: 'HTML5', level: 95, category: 'Expert' },
    { name: 'CSS3', level: 90, category: 'Expert' },
    { name: 'JavaScript', level: 88, category: 'Advanced' },
    { name: 'TypeScript', level: 85, category: 'Advanced' },
    { name: 'React', level: 92, category: 'Expert' },
    { name: 'Next.js', level: 88, category: 'Advanced' },
    { name: 'Node.js', level: 80, category: 'Proficient' },
    { name: 'Tailwind CSS', level: 90, category: 'Expert' },
    { name: 'Git', level: 85, category: 'Advanced' },
  ];

  return (
    <section id="skills" className="px-16 py-24 bg-[#141414] relative">
      {/* Purple gradient background */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-2">
        <div className="text-center mb-16 fade-up opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">My Skills</h2>
          <div className="w-20 h-1 bg-[#8b5cf6] mx-auto"></div>
        </div>
        
        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div 
              key={skill.name}
              className="skill-card border border-[rgba(139,92,246,0.2)] p-6 relative transition-all duration-300 overflow-hidden hover:border-[#8b5cf6] hover:-translate-y-1 fade-up opacity-0 translate-y-8 bg-[#0a0a0a]"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Hover effect top border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#8b5cf6] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
              
              <div className="skill-name font-serif text-xl font-bold mb-4 text-white">{skill.name}</div>
              
              <div className="skill-level-bar w-full h-2 bg-[rgba(255,255,255,0.1)] mt-4 relative rounded-full">
                <div 
                  className="skill-level-fill h-full bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] transition-all duration-1000 ease-out rounded-full"
                  data-width={`${skill.level}%`}
                ></div>
              </div>
              <div className="skill-pct font-mono text-xs text-[#8b5cf6] tracking-[0.1em] mt-2">
                {skill.category} · {skill.level}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
