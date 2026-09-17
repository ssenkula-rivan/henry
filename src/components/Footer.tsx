'use client';

import InstagramIcon from '@/components/InstagramIcon';
import BehanceIcon from '@/components/BehanceIcon';
import LinkedInIcon from '@/components/LinkedInIcon';
import TwitterIcon from '@/components/TwitterIcon';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[rgba(139,92,246,0.18)] px-16 py-12 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-4">Contact Me</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#8b5cf6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:henry@example.com" className="text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline">
                  henry@example.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#8b5cf6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a href="tel:+256700000000" className="text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline">
                  +256 700 000 000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#8b5cf6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="text-[rgba(245,240,235,0.8)]">Kampala, Uganda</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-4">Follow Me</h3>
            <div className="flex gap-4 mb-4">
              <a 
                href="https://www.instagram.com/alkemy_visuals/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#141414] border border-[rgba(139,92,246,0.3)] text-[#8b5cf6] flex items-center justify-center hover:bg-[#8b5cf6] hover:text-black transition-all duration-300 no-underline"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://www.behance.net/mbalirehenry-1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#141414] border border-[rgba(139,92,246,0.3)] text-[#8b5cf6] flex items-center justify-center hover:bg-[#8b5cf6] hover:text-black transition-all duration-300 no-underline"
                aria-label="Behance"
              >
                <BehanceIcon />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#141414] border border-[rgba(139,92,246,0.3)] text-[#8b5cf6] flex items-center justify-center hover:bg-[#8b5cf6] hover:text-black transition-all duration-300 no-underline"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#141414] border border-[rgba(139,92,246,0.3)] text-[#8b5cf6] flex items-center justify-center hover:bg-[#8b5cf6] hover:text-black transition-all duration-300 no-underline"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
            </div>
            <div className="space-y-2">
              <a href="https://www.instagram.com/alkemy_visuals/" target="_blank" rel="noopener noreferrer" className="block text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline text-sm">
                @alkemy_visuals
              </a>
              <a href="https://www.behance.net/mbalirehenry-1" target="_blank" rel="noopener noreferrer" className="block text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline text-sm">
                Behance Portfolio
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline">Home</a>
              <a href="#about" className="block text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline">About</a>
              <a href="#projects" className="block text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline">Projects</a>
              <a href="#contact" className="block text-[rgba(245,240,235,0.8)] hover:text-[#8b5cf6] transition-colors no-underline">Contact</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(139,92,246,0.18)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="footer-copy font-mono text-xs tracking-[0.1em] text-[#888]">
            © 2025 Mbalire Henry. All rights reserved.
          </div>
          <div className="footer-mark font-serif text-sm text-[#8b5cf6] italic">
            Designed with passion
          </div>
        </div>
      </div>
    </footer>
  );
}
