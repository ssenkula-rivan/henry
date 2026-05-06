export default function Marquee() {
  return (
    <div className="border-t border-[rgba(232,200,74,0.18)] border-b border-[rgba(232,200,74,0.18)] overflow-hidden bg-[rgba(232,200,74,0.04)] py-4">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Brand Identity<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Print Design<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">UI/UX Design<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">3D Modeling<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Motion Graphics<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Logo Design<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Typography<span className="opacity-50">•</span></span>
        
        {/* Duplicate for seamless loop */}
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Brand Identity<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Print Design<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">UI/UX Design<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">3D Modeling<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Motion Graphics<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Logo Design<span className="opacity-50">•</span></span>
        <span className="marquee-item font-serif text-base italic text-[#e8c84a] opacity-70 flex items-center gap-6">Typography<span className="opacity-50">•</span></span>
      </div>
    </div>
  );
}
