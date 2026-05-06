'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'es', name: 'ES', flag: '🇪🇸' },
  ];

  return (
    <div className="fixed top-24 right-8 z-50 flex flex-col gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as 'en' | 'fr' | 'es')}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
            language === lang.code
              ? 'bg-[#e8c84a] text-black scale-110 shadow-lg'
              : 'bg-black/50 backdrop-blur-sm text-white border border-[rgba(232,200,74,0.18)] hover:border-[#e8c84a] hover:scale-105'
          }`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
