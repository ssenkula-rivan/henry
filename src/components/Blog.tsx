'use client';

import { useEffect } from 'react';

export default function Blog() {
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

  const blogPosts = [
    {
      title: 'Getting Started with Next.js 14',
      excerpt: 'Learn how to build modern web applications with the latest Next.js features and improvements.',
      date: 'March 15, 2024',
      category: 'Web Development'
    },
    {
      title: 'Mastering Tailwind CSS',
      excerpt: 'A comprehensive guide to utility-first CSS and how to leverage Tailwind for rapid development.',
      date: 'March 10, 2024',
      category: 'CSS'
    },
    {
      title: 'TypeScript Best Practices',
      excerpt: 'Essential TypeScript patterns and practices for writing type-safe and maintainable code.',
      date: 'March 5, 2024',
      category: 'JavaScript'
    }
  ];

  return (
    <section id="blog" className="py-24 px-16 bg-[#141414] relative">
      {/* Purple gradient background */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-2">
        <div className="text-center mb-16 fade-up opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">Latest Blog Posts</h2>
          <div className="w-20 h-1 bg-[#8b5cf6] mx-auto"></div>
        </div>

        <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div 
              key={post.title}
              className="blog-card bg-[#0a0a0a] border border-[rgba(139,92,246,0.2)] p-6 transition-all duration-300 hover:border-[#8b5cf6] hover:-translate-y-2 fade-up opacity-0 translate-y-8"
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="blog-category font-mono text-xs tracking-widest uppercase text-[#8b5cf6] mb-3">
                {post.category}
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">{post.title}</h3>
              <p className="text-[rgba(245,240,235,0.7)] text-sm leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <div className="blog-date font-mono text-xs text-[#888]">
                {post.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}