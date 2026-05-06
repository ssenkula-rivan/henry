'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  images: string[];
  description: string;
}

const categories: Category[] = [
  {
    id: 'photoshop',
    name: 'Photoshop',
    icon: 'PS',
    color: 'from-[#31A8FF] to-[#0078D7]',
    images: [
      '/images/projects/photoshop/WEB1.jpg',
      '/images/projects/photoshop/WEB1-2.jpg',
      '/images/projects/photoshop/WEB1-3.jpg',
      '/images/projects/photoshop/WEB1-4.jpg',
      '/images/projects/photoshop/web1-5.jpg',
      '/images/projects/photoshop/WEB 6.jpg',
      '/images/projects/photoshop/WEB 7.jpg',
      '/images/projects/photoshop/WEB 8.jpg',
      '/images/projects/photoshop/WEB 9.jpg',
    ],
    description: 'Digital art, photo editing, and creative compositions'
  },
  {
    id: 'illustrator',
    name: 'Illustrator',
    icon: 'AI',
    color: 'from-[#FF6B35] to-[#F7931E]',
    images: [],
    description: 'Vector art, logos, and brand identity systems'
  },
  {
    id: 'indesign',
    name: 'InDesign',
    icon: 'ID',
    color: 'from-[#FF3366] to-[#CC0033]',
    images: [],
    description: 'Print layouts, publications, and editorial design'
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: 'FI',
    color: 'from-[#0ACF83] to-[#0ACF83]',
    images: [],
    description: 'UI/UX design, prototyping, and design systems'
  },
  {
    id: 'blender',
    name: 'Blender',
    icon: 'B3D',
    color: 'from-[#EA7600] to-[#F57900]',
    images: [],
    description: '3D modeling, rendering, and animation'
  },
  {
    id: 'brand',
    name: 'Brand Identity',
    icon: 'BR',
    color: 'from-[#8B5CF6] to-[#7C3AED]',
    images: [],
    description: 'Complete brand systems and visual identities'
  }
];

export default function CategoryPortfolio() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setCurrentImageIndex(prev => ({ ...prev, [categoryId]: 0 }));
    }
  };

  const nextImage = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [categoryId]: (prev[categoryId] + 1) % category.images.length
      }));
    }
  };

  const prevImage = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [categoryId]: prev[categoryId] === 0 ? category.images.length - 1 : prev[categoryId] - 1
      }));
    }
  };

  return (
    <section id="portfolio" className="px-16 py-24 bg-[#141414]">
      <div className="section-tag font-mono text-xs tracking-[0.3em] uppercase text-[#e8c84a] mb-2">{t('portfolio.selected')}</div>
      <h2 className="section-heading font-serif text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1.1] mb-4">{t('portfolio.title')}</h2>
      <p className="section-sub text-[#888] text-base leading-relaxed max-w-[540px] mb-3">
        {t('portfolio.description')}
      </p>
      <div className="divider w-16 h-0.5 bg-[#e8c84a] mb-12"></div>
      
      <div className="category-grid grid grid-cols-3 gap-6 mt-12">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`category-card relative aspect-[4/3] cursor-pointer transition-all duration-500 transform-gpu ${
              selectedCategory === category.id ? 'col-span-3 row-span-2' : 'hover:scale-[0.98]'
            } fade-up opacity-0 translate-y-8`}
            style={{ transitionDelay: `${index * 0.1}s` }}
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Card Content */}
            <div className={`w-full h-full border border-[rgba(232,200,74,0.18)] overflow-hidden relative ${
              selectedCategory === category.id ? 'bg-[#0a0a0a]' : `bg-gradient-to-br ${category.color}`
            }`}>
              
              {/* Category View (Collapsed) */}
              {selectedCategory !== category.id && (
                <div className="flex flex-col items-center justify-center h-full p-6 text-white text-center">
                  <div className="text-6xl font-black mb-4 opacity-80">{category.icon}</div>
                  <h3 className="font-serif text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-80 max-w-[200px]">{category.description}</p>
                  <div className="mt-4 text-xs font-mono tracking-widest uppercase opacity-60">
                    {category.images.length} Projects
                  </div>
                </div>
              )}

              {/* Expanded View (Image Gallery) */}
              {selectedCategory === category.id && (
                <div className="h-full flex items-center justify-center p-8">
                  {category.images.length > 0 ? (
                    <div className="relative w-full h-full max-w-4xl">
                      {/* Main Image */}
                      <img
                        src={category.images[currentImageIndex[category.id] || 0]}
                        alt={`${category.name} project ${currentImageIndex[category.id] || 0 + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      
                      {/* Navigation Arrows */}
                      {category.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(category.id);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[rgba(10,10,10,0.8)] text-white p-3 rounded-full hover:bg-[rgba(232,200,74,0.2)] transition-colors"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M15 18l-6-6 6-6"/>
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(category.id);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[rgba(10,10,10,0.8)] text-white p-3 rounded-full hover:bg-[rgba(232,200,74,0.2)] transition-colors"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18l6-6-6-6"/>
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      {category.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[rgba(10,10,10,0.8)] text-white px-4 py-2 rounded-full text-sm font-mono">
                          {(currentImageIndex[category.id] || 0) + 1} / {category.images.length}
                        </div>
                      )}
                      
                      {/* Category Info */}
                      <div className="absolute top-4 left-4 bg-[rgba(10,10,10,0.8)] text-white p-4 rounded-lg max-w-[300px]">
                        <h3 className="font-serif text-lg font-bold mb-1">{category.name}</h3>
                        <p className="text-sm opacity-80 mb-2">{category.description}</p>
                        <div className="text-xs font-mono tracking-widest uppercase text-[#e8c84a]">
                          {category.images.length} Projects
                        </div>
                      </div>
                      
                      {/* Close Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(null);
                        }}
                        className="absolute top-4 right-4 bg-[#e8c84a] text-black p-3 rounded-full hover:bg-[#b8981e] transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <div className="text-6xl font-black mb-4 opacity-40">{category.icon}</div>
                      <h3 className="font-serif text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-lg opacity-60 mb-4">Coming Soon</p>
                      <p className="text-sm opacity-40 max-w-[400px] mx-auto">{category.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
