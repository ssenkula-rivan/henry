'use client';

import { useState, useEffect } from 'react';
import LiveChat from '@/components/LiveChat';

export default function Navigation() {
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
        scrolled ? 'bg-black/85 backdrop-blur-xl border-b border-[rgba(139,92,246,0.18)]' : 'bg-transparent'
      }`}>
        <div className="font-serif text-xl font-bold tracking-wider text-[#8b5cf6]">
          M·H
        </div>
        
        <ul className="flex gap-9 list-none">
          <li><a href="#home" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#8b5cf6] transition-all duration-200">Home</a></li>
          <li><a href="#about" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#8b5cf6] transition-all duration-200">About</a></li>
          <li><a href="#skills" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#8b5cf6] transition-all duration-200">Skills</a></li>
          <li><a href="#projects" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#8b5cf6] transition-all duration-200">Projects</a></li>
          <li><a href="#blog" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#8b5cf6] transition-all duration-200">Blog</a></li>
          <li><a href="#contact" className="font-mono text-xs tracking-widest uppercase text-white opacity-65 hover:opacity-100 hover:text-[#8b5cf6] transition-all duration-200">Contact</a></li>
        </ul>
        
        <button 
          onClick={() => setShowChat(true)}
          className="bg-[#8b5cf6] text-black px-8 py-3 font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#7c3aed] hover:-translate-y-0.5 transition-all duration-200"
        >
          Hire Me
        </button>
      </nav>
      
      {/* Live Chat Component */}
      <LiveChat />
    </>
  );
}
