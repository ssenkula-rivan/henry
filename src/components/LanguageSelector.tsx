'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'es', name: 'ES' },
  ];

  return (
    <div className="fixed top-24 right-8 z-50 flex flex-col gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as 'en' | 'fr' | 'es')}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
            language === lang.code
              ? 'bg-[#e8c84a] text-black scale-110 shadow-lg'
              : 'bg-black/50 backdrop-blur-sm text-white border border-[rgba(232,200,74,0.18)] hover:border-[#e8c84a] hover:scale-105'
          }`}
          title={lang.name}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
