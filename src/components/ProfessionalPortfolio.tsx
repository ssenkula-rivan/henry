'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Project {
  id: string;
  title: string;
  category: string;
  tools: string;
  image: string;
  description: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 'ps1',
    title: 'Digital Art',
    category: 'Digital Art',
    tools: 'Photoshop',
    image: '/images/projects/photoshop/WEB1.jpg',
    description: 'Advanced digital composition',
    featured: true
  },
  {
    id: 'ps2',
    title: 'Photo Editing',
    category: 'Photo Editing',
    tools: 'Photoshop',
    image: '/images/projects/photoshop/WEB1-2.jpg',
    description: 'Professional photo retouching',
    featured: true
  },
  {
    id: 'ps3',
    title: 'Brand Design',
    category: 'Brand Identity',
    tools: 'Photoshop',
    image: '/images/projects/photoshop/WEB1-3.jpg',
    description: 'Creative brand visual design'
  },
  {
    id: 'ps4',
    title: 'Creative Work',
    category: 'Digital Art',
    tools: 'Photoshop',
    image: '/images/projects/photoshop/WEB1-4.jpg',
    description: 'Innovative digital composition'
  },
  {
    id: 'ps5',
    title: 'Marketing',
    category: 'Marketing Design',
    tools: 'Photoshop',
    image: '/images/projects/photoshop/web1-5.jpg',
    description: 'Professional marketing visual'
  },
  {
    id: 'ps6',
    title: 'Portrait',
    category: 'Portrait Photography',
    tools: 'Photoshop',
    image: '/images/projects/photoshop/WEB 6.jpg',
    description: 'Artistic portrait editing'
  }
];

const categories = ['All', 'Digital Art', 'Photo Editing', 'Brand Identity', 'Marketing Design', 'Portrait Photography'];

export default function ProfessionalPortfolio() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="portfolio" className="px-16 py-24 bg-[#141414]">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-tag font-mono text-xs tracking-[0.3em] uppercase text-[#e8c84a] mb-2">
            {t('portfolio.selected')}
          </div>
          <h2 className="section-heading font-serif text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.1] mb-6">
            {t('portfolio.title')}
          </h2>
          <p className="section-sub text-[#888] text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {t('portfolio.description')}
          </p>
          <div className="divider w-16 h-0.5 bg-[#e8c84a] mx-auto"></div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[#0a0a0a] border border-[rgba(232,200,74,0.18)] rounded-full p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 font-mono text-xs tracking-widest uppercase rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#e8c84a] text-black'
                    : 'text-white hover:text-[#e8c84a]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`project-card group relative overflow-hidden ${
                project.featured ? 'md:col-span-2 lg:col-span-2' : ''
              } fade-up opacity-0 translate-y-8`}
              style={{ transitionDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image */}
              <div className={`relative ${project.featured ? 'aspect-[16/9]' : 'aspect-[4/3]'} overflow-hidden bg-[#0a0a0a]`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.9)] via-[rgba(10,10,10,0.3)] to-transparent opacity-60"></div>
                
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-[rgba(10,10,10,0.85)] transition-opacity duration-300 ${
                  hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="space-y-3">
                      {/* Category */}
                      <div className="flex items-center gap-3">
                        <span className="text-[#e8c84a] font-mono text-xs tracking-[0.1em] uppercase">
                          {project.category}
                        </span>
                        <span className="text-[rgba(255,255,255,0.4)]">•</span>
                        <span className="text-white font-mono text-xs tracking-[0.1em] uppercase opacity-70">
                          {project.tools}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-serif text-xl font-bold text-white leading-tight">
                        {project.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-[rgba(255,255,255,0.7)] text-sm leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                      
                      {/* View Project Button */}
                      <button className="mt-4 bg-[#e8c84a] text-black px-4 py-2 font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#b8981e] transition-colors duration-200">
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 bg-[#e8c84a] text-black px-3 py-1 font-mono text-xs tracking-widest uppercase font-bold">
                    Featured
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="border border-[rgba(232,200,74,0.3)] text-white px-8 py-3 font-mono text-xs tracking-widest uppercase hover:border-[#e8c84a] hover:text-[#e8c84a] transition-all duration-300">
            Load More Projects
          </button>
        </div>
      </div>
    </section>
  );
}
