'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhotoshopProject {
  id: string;
  title: string;
  image: string;
  description: string;
  featured?: boolean;
}

const photoshopProjects: PhotoshopProject[] = [
  {
    id: 'ps1',
    title: 'Digital Art Composition',
    image: '/images/projects/photoshop/WEB1.jpg',
    description: 'Advanced digital composition showcasing photo manipulation and artistic techniques',
    featured: true
  },
  {
    id: 'ps2',
    title: 'Photo Retouching',
    image: '/images/projects/photoshop/WEB1-2.jpg',
    description: 'Professional photo retouching and enhancement demonstrating advanced editing skills',
    featured: true
  },
  {
    id: 'ps3',
    title: 'Brand Visual Design',
    image: '/images/projects/photoshop/WEB1-3.jpg',
    description: 'Creative brand visual design with modern aesthetics and professional composition'
  },
  {
    id: 'ps4',
    title: 'Creative Composition',
    image: '/images/projects/photoshop/WEB1-4.jpg',
    description: 'Innovative digital composition blending multiple elements seamlessly'
  },
  {
    id: 'ps5',
    title: 'Marketing Visual',
    image: '/images/projects/photoshop/web1-5.jpg',
    description: 'Professional marketing visual designed for promotional campaigns'
  },
  {
    id: 'ps6',
    title: 'Artistic Portrait',
    image: '/images/projects/photoshop/WEB 6.jpg',
    description: 'Artistic portrait editing with advanced color grading and effects'
  },
  {
    id: 'ps7',
    title: 'Creative Design',
    image: '/images/projects/photoshop/WEB 7.jpg',
    description: 'Creative design project showcasing advanced Photoshop techniques'
  },
  {
    id: 'ps8',
    title: 'Visual Storytelling',
    image: '/images/projects/photoshop/WEB 8.jpg',
    description: 'Visual storytelling through compelling digital imagery'
  },
  {
    id: 'ps9',
    title: 'Professional Editing',
    image: '/images/projects/photoshop/WEB 9.jpg',
    description: 'Professional photo editing with attention to detail and quality'
  }
];

export default function PhotoshopPortfolio() {
  const { t } = useLanguage();

  return (
    <section id="photoshop-portfolio" className="px-16 py-24 bg-[#141414]">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {/* Adobe Photoshop Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#31A8FF] to-[#0078D7] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">Ps</span>
            </div>
          </div>
          
          <div className="section-tag font-mono text-xs tracking-[0.3em] uppercase text-[#e8c84a] mb-2">
            Adobe Photoshop
          </div>
          <h2 className="section-heading font-serif text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.1] mb-6">
            Photoshop Projects
          </h2>
          <p className="section-sub text-[#888] text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Photo editing, digital painting, compositing & retouching
          </p>
          <div className="divider w-16 h-0.5 bg-[#e8c84a] mx-auto"></div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {photoshopProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card relative overflow-hidden fade-up opacity-0 translate-y-8"
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              {/* Project Image */}
              <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Simple Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.8)] to-transparent"></div>
                
                {/* Project Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="space-y-1">
                    {/* Photoshop Badge */}
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#31A8FF] rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">Ps</span>
                      </div>
                      <span className="text-[#31A8FF] font-mono text-xs tracking-[0.1em] uppercase">
                        Photoshop
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-serif text-xs font-bold text-white leading-tight">
                      {project.title}
                    </h3>
                  </div>
                </div>
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-1 left-1 bg-[#e8c84a] text-black px-1 py-0.5 font-mono text-xs tracking-widest uppercase font-bold">
                    ★
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="border border-[rgba(49,168,255,0.3)] text-white px-8 py-3 font-mono text-xs tracking-widest uppercase hover:border-[#31A8FF] hover:text-[#31A8FF] transition-all duration-300">
            Load More Projects
          </button>
        </div>
      </div>
    </section>
  );
}
