'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TimezoneDisplay from '@/components/TimezoneDisplay';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import PhoneIcon from '@/components/PhoneIcon';

export default function Contact() {
  const { t } = useLanguage();
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

  const contactDetails = [
    { label: 'Location', value: 'Kampala, Uganda' },
    { label: 'Age', value: '30 years old' },
    { label: 'Experience', value: '5+ Years' },
    { label: 'Availability', value: '● Open to Work', special: true },
  ];

  const socialLinks = [
    'Behance',
    'LinkedIn', 
    'Instagram',
    'Dribbble',
  ];

  return (
    <section id="contact" className="px-16 py-24 bg-gradient-to-br from-[#0a0a0a] to-[#111108] text-center">
      <div className="contact-inner max-w-[640px] mx-auto">
        <div className="section-tag font-mono text-xs tracking-[0.3em] uppercase text-[#e8c84a] mb-2 text-center block">{t('contact.getInTouch')}</div>
        <h2 className="section-heading font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-black leading-[1.1] mb-4 fade-up">
          {t('contact.create')}
        </h2>
        <div className="divider w-16 h-0.5 bg-[#e8c84a] my-6 mx-auto"></div>
        
        <p className="text-[#888] text-base leading-relaxed mb-4">
          {t('contact.available')}
        </p>
        
        <TimezoneDisplay />
        
                
        {/* Hire Me Button */}
        <div className="flex justify-center my-8">
          <div className="flex gap-4">
            {/* Email Button */}
            <a 
              href="mailto:mbalirehenry@gmail.com?subject=Hiring%20Inquiry&body=Hi%20Henry,%0A%0AI%20would%20like%20to%20hire%20you%20for%20a%20project.%20Please%20let%20me%20know%20your%20availability%20and%20rates.%0A%0ABest%20regards"
              target="_blank"
              className="bg-[#e8c84a] text-black px-8 py-4 font-mono text-sm tracking-widest uppercase font-bold hover:bg-[#b8981e] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl transform no-underline"
            >
              Email Me
            </a>
            
                        
            {/* Telegram Button */}
            <a 
              href="https://t.me/mbalirehenry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0088CC] text-white px-8 py-4 font-mono text-sm tracking-widest uppercase font-bold hover:bg-[#006699] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl transform no-underline"
            >
              Telegram Me
            </a>
          </div>
        </div>
        
        {/* WhatsApp Button */}
        <div className="flex justify-center my-8">
          <a 
            href="https://wa.me/256758877168?text=Hi%20Henry,%20I%20would%20like%20to%20hire%20you%20for%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-8 py-4 font-mono text-sm tracking-widest uppercase font-bold hover:bg-[#128C7E] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl transform no-underline flex items-center gap-2"
          >
            <WhatsAppIcon className="w-5 h-5" />
            WhatsApp Me
          </a>
        </div>
                
        <div className="contact-details flex justify-center gap-12 my-10 flex-wrap">
          {contactDetails.map((detail, index) => (
            <div key={index} className="contact-item text-center">
              <div className="contact-item-label font-mono text-xs tracking-[0.2em] uppercase text-[#888] mb-1">
                {t(`contact.${detail.label.toLowerCase()}`)}
              </div>
              <div className={`contact-item-value text-sm ${detail.special ? 'text-[#e8c84a]' : 'text-white'}`}>
                {detail.label === 'Availability' ? t('contact.openToWork') : detail.value}
              </div>
            </div>
          ))}
        </div>
        
        <div className="socials flex justify-center gap-5 mt-10">
          {socialLinks.map((social, index) => {
            let href = "#";
            let displayText = social;
            
            if (social === 'Instagram') {
              href = "https://www.instagram.com/mbalire_henry?igsh=OWZpMXI5ZHdxc2c=&utm_source=ig_contact_invite";
              displayText = "@mbalire_henry";
            } else if (social === 'Behance') {
              href = "https://www.behance.net/mbalirehenry-1";
              displayText = "Behance";
            } else if (social === 'LinkedIn') {
              href = "https://www.linkedin.com/in/mbalire-henry-b47ba12aa?utm_source=share_via&utm_content=profile&utm_medium=member_android";
              displayText = "LinkedIn";
            }
            
            return (
              <a 
                key={index}
                href={href} 
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn border border-[rgba(232,200,74,0.18)] text-white px-5 py-2.5 font-mono text-xs tracking-[0.12em] uppercase no-underline transition-all duration-200 hover:border-[#e8c84a] hover:text-[#e8c84a]"
              >
                {displayText}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
