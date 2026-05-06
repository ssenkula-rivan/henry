'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'es';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.skills': { en: 'Skills', fr: 'Compétences', es: 'Habilidades' },
  'nav.experience': { en: 'Experience', fr: 'Expérience', es: 'Experiencia' },
  'nav.work': { en: 'Work', fr: 'Travail', es: 'Trabajo' },
  'nav.contact': { en: 'Contact', fr: 'Contact', es: 'Contacto' },
  'nav.hire': { en: 'Hire Me', fr: 'M\'embaucher', es: 'Contrátame' },
  
  // Hero
  'hero.available': { en: 'Available for Freelance', fr: 'Disponible pour freelance', es: 'Disponible para freelance' },
  'hero.title': { en: 'Graphic Designer · Visual Artist · Brand Identity', fr: 'Designer Graphique · Artiste Visuel · Identité de Marque', es: 'Diseñador Gráfico · Artista Visual · Identidad de Marca' },
  'hero.bio': { en: 'With over five years of experience in the creative industry, I bring a well-rounded approach to design, combining visual storytelling with practical problem-solving. I am proficient in industry-standard tools including Adobe Photoshop, Illustrator, and InDesign for graphic design, Figma for UI/UX design and prototyping, and Blender for 3D modeling and animation. My work focuses on creating visually engaging and user-centered solutions across both digital and print platforms, with a strong attention to detail and a passion for delivering designs that not only look good but communicate effectively and add real value.', fr: 'Avec plus de cinq ans d\'expérience dans l\'industrie créative, j\'apporte une approche équilibrée au design, combinant la narration visuelle avec la résolution de problèmes pratiques. Je suis compétent dans les outils standards de l\'industrie, notamment Adobe Photoshop, Illustrator et InDesign pour le design graphique, Figma pour le design UI/UX et le prototypage, et Blender pour la modélisation 3D et l\'animation. Mon travail se concentre sur la création de solutions visuellement engageantes et centrées sur l\'utilisateur sur les plateformes numériques et imprimées, avec une grande attention aux détails et une passion pour la livraison de designs qui non seulement semblent bons mais communiquent efficacement et ajoutent une réelle valeur.', es: 'Con más de cinco años de experiencia en la industria creativa, aporto un enfoque equilibrado al diseño, combinando la narración visual con la resolución práctica de problemas. Soy competente en herramientas estándar de la industria, incluyendo Adobe Photoshop, Illustrator e InDesign para diseño gráfico, Figma para diseño UI/UX y prototipado, y Blender para modelado 3D y animación. Mi trabajo se enfoca en crear soluciones visualmente atractivas y centradas en el usuario en plataformas digitales e impresas, con una fuerte atención al detalle y una pasión por entregar diseños que no solo se ven bien sino que comunican efectivamente y agregan valor real.' },
  'hero.years': { en: 'Years Experience', fr: 'Années d\'expérience', es: 'Años de experiencia' },
  'hero.projects': { en: 'Projects Done', fr: 'Projets réalisés', es: 'Proyectos realizados' },
  'hero.clients': { en: 'Happy Clients', fr: 'Clients satisfaits', es: 'Clientes felices' },
  'hero.viewWork': { en: 'View My Work', fr: 'Voir mon travail', es: 'Ver mi trabajo' },
  'hero.letsTalk': { en: 'Let\'s Talk', fr: 'Discutons', es: 'Hablemos' },
  
  // Skills
  'skills.title': { en: 'Software & Skills', fr: 'Logiciels & Compétences', es: 'Software & Habilidades' },
  'skills.whatIUse': { en: 'What I Use', fr: 'Ce que j\'utilise', es: 'Lo que uso' },
  'skills.expert': { en: 'Expert', fr: 'Expert', es: 'Experto' },
  'skills.advanced': { en: 'Advanced', fr: 'Avancé', es: 'Avanzado' },
  'skills.proficient': { en: 'Proficient', fr: 'Compétent', es: 'Competente' },
  
  // Experience
  'experience.title': { en: 'Work Experience', fr: 'Expérience professionnelle', es: 'Experiencia laboral' },
  'experience.timeline': { en: 'Career Timeline', fr: 'Chronologie de carrière', es: 'Línea de tiempo profesional' },
  
  // Portfolio
  'portfolio.title': { en: 'Portfolio', fr: 'Portfolio', es: 'Portfolio' },
  'portfolio.selected': { en: 'Selected Work', fr: 'Travaux sélectionnés', es: 'Trabajos seleccionados' },
  'portfolio.description': { en: 'A selection of brand identity, print, and digital projects spanning 5 years of practice.', fr: 'Une sélection d\'identités de marque, d\'imprimés et de projets numériques couvrant 5 ans de pratique.', es: 'Una selección de proyectos de identidad de marca, impresión y digitales que abarcan 5 años de práctica.' },
  
  // Contact
  'contact.getInTouch': { en: 'Get In Touch', fr: 'Contactez-moi', es: 'Ponte en contacto' },
  'contact.create': { en: 'Let\'s Create Something Great', fr: 'Créons quelque chose de génial', es: 'Creemos algo genial' },
  'contact.available': { en: 'Available for freelance projects, brand identity work, and long-term collaborations. Based in Kampala — working globally.', fr: 'Disponible pour des projets freelance, travaux d\'identité de marque et collaborations à long terme. Basé à Kampala — travaillant globalement.', es: 'Disponible para proyectos freelance, trabajos de identidad de marca y colaboraciones a largo plazo. Basado en Kampala — trabajando globalmente.' },
  'contact.location': { en: 'Location', fr: 'Localisation', es: 'Ubicación' },
  'contact.age': { en: 'Age', fr: 'Âge', es: 'Edad' },
  'contact.experience': { en: 'Experience', fr: 'Expérience', es: 'Experiencia' },
  'contact.availability': { en: 'Availability', fr: 'Disponibilité', es: 'Disponibilidad' },
  'contact.openToWork': { en: '● Open to Work', fr: '● Ouvert au travail', es: '● Abierto al trabajo' },
  
  // Footer
  'footer.copyright': { en: '© 2025 Mbalire Henry. All rights reserved.', fr: '© 2025 Mbalire Henry. Tous droits réservés.', es: '© 2025 Mbalire Henry. Todos los derechos reservados.' },
  'footer.designed': { en: 'Designed with intention.', fr: 'Conçu avec intention.', es: 'Diseñado con intención.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
