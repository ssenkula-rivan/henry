'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-[rgba(232,200,74,0.18)] px-16 py-6 flex justify-between items-center bg-[#0a0a0a]">
      <div className="footer-copy font-mono text-xs tracking-[0.1em] text-[#888]">
        {t('footer.copyright')}
      </div>
      <div className="footer-mark font-serif text-sm text-[#e8c84a] italic">
        {t('footer.designed')}
      </div>
    </footer>
  );
}
