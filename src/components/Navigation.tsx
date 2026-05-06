'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LiveChat from '@/components/LiveChat';

export default function Navigation() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-100 flex justify-between items-center px-16 py-8 transition-all duration-300 ${
        scrolled ? 'bg-black/85 backdrop-blur-xl border-b border-[rgba(232,200,74,0.18)]' : 'bg-transparent'
      }`}>
        <div className="font-serif text-xl font-bold tracking-wider text-[#e8c84a]">
          M·H
        </div>
        
        <ul className="flex gap-9 list-none">
          <li><a href="#skills" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#e8c84a] transition-all duration-200">{t('nav.skills')}</a></li>
          <li><a href="#experience" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#e8c84a] transition-all duration-200">{t('nav.experience')}</a></li>
          <li><a href="#portfolio" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#e8c84a] transition-all duration-200">{t('nav.work')}</a></li>
                  </ul>
        
        <button 
          onClick={() => setShowChat(true)}
          className="bg-[#e8c84a] text-black px-8 py-3 font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#b8981e] hover:-translate-y-0.5 transition-all duration-200"
        >
          {t('nav.hire')}
        </button>
      </nav>
      
      {/* Live Chat Component */}
      <LiveChat />
    </>
  );
}
