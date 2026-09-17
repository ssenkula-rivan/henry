'use client';

import { useEffect } from 'react';

export default function Projects() {
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

  const projects = [
    {
      title: 'Brand Identity Design',
      description: 'Complete brand identity system including logo design, color palette, typography, and brand guidelines for a tech startup.',
      technologies: ['Illustrator', 'Photoshop', 'InDesign'],
      image: '/brand-identity-placeholder.jpg'
    },
    {
      title: 'Social Media Campaign',
      description: 'Visual assets and creative direction for a comprehensive social media marketing campaign across multiple platforms.',
      technologies: ['Photoshop', 'After Effects', 'Premiere Pro'],
      image: '/social-campaign-placeholder.jpg'
    },
    {
      title: 'Product Photography',
      description: 'Professional product photography and post-production editing for e-commerce and marketing materials.',
      technologies: ['Lightroom', 'Photoshop', 'Studio Lighting'],
      image: '/product-photo-placeholder.jpg'
    }
  ];

  return (
    <section id="projects" className="py-24 px-16 bg-black relative">
      {/* Purple gradient background */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-2">
        <div className="text-center mb-16 fade-up opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-[#8b5cf6] mx-auto"></div>
        </div>

        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.title}
              className="project-card bg-[#141414] border border-[rgba(139,92,246,0.2)] overflow-hidden transition-all duration-300 hover:border-[#8b5cf6] hover:-translate-y-2 fade-up opacity-0 translate-y-8"
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              {/* Project image placeholder */}
              <div className="project-image h-48 bg-gradient-to-br from-[#1a1206] to-[#2d2310] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <span className="relative text-white/30 font-serif text-4xl">{project.title.split(' ')[0]}</span>
              </div>
              
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-[rgba(245,240,235,0.7)] text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                
                <div className="technologies flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="bg-[#0a0a0a] border border-[rgba(139,92,246,0.3)] text-[#8b5cf6] px-3 py-1 font-mono text-xs tracking-wider uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}