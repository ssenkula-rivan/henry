# Mbalire Henry — Portfolio Website

A modern, international portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features multi-language support, timezone-aware contact information, and responsive design optimized for global audiences.

##  Features

- **Modern Tech Stack**: Next.js 16, TypeScript, Tailwind CSS
- **Multi-Language Support**: English, French, Spanish with instant switching
- **Timezone-Aware**: Real-time availability status based on business hours
- **Responsive Design**: Optimized for all devices and screen sizes
- **Performance Optimized**: Image optimization, lazy loading, and efficient bundling
- **SEO Friendly**: Meta tags, structured data, and semantic HTML
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Smooth Animations**: Intersection Observer-based scroll animations
- **Professional Design**: Dark theme with gold accents and modern typography

## ️ Technologies Used

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Google Fonts (Playfair Display, DM Sans, Space Mono)
- **Icons**: Emoji icons for lightweight implementation
- **Animations**: CSS animations and Intersection Observer API

##  Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd henry-portfolio-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Type checking without emitting
- `npm run build:analyze` - Build with bundle analysis

##  Internationalization

The portfolio supports three languages:
- English (EN) 
- French (FR)   
- Spanish (ES) 

Language switching is instant and preserves the current page state. All content including navigation, sections, and contact information is fully translated.

##  Timezone Features

- Real-time clock showing visitor's local time
- Business hours indicator (9AM-6PM EAT)
- Availability status based on Uganda timezone
- Automatic updates every minute

##  Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out`
3. Enable build optimization

### Static Export
```bash
npm run build
npm run export
```

##  Customization

### Colors
Primary color scheme is defined in CSS variables:
- `--gold: #e8c84a` (primary accent)
- `--black: #0a0a0a` (background)
- `--white: #f5f0eb` (text)

### Fonts
- **Serif**: Playfair Display (headings)
- **Sans**: DM Sans (body text)
- **Mono**: Space Mono (technical text)

### Adding New Languages
1. Update `translations` object in `src/contexts/LanguageContext.tsx`
2. Add language option to `LanguageSelector.tsx`
3. Update font imports if needed

##  Responsive Breakpoints

- Mobile: < 520px
- Tablet: 520px - 900px
- Desktop: > 900px

##  Performance Features

- Image optimization with WebP/AVIF support
- Lazy loading for components
- Efficient bundle splitting
- CSS optimization
- Compression enabled
- Cache headers configured

## ️ Security

- XSS protection headers
- Content type protection
- Frame protection
- Secure defaults

##  Analytics & SEO

- Open Graph tags
- Twitter Card meta
- Structured data ready
- SEO-friendly URLs
- Semantic HTML5

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

##  License

© 2025 Mbalire Henry. All rights reserved.

---

**Designed with intention. Built with modern web technologies for global reach.**
