export default function IllustratorIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="ai-gradient-unique" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9A00" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
        <filter id="ai-shadow-unique" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="6" fill="url(#ai-gradient-unique)" filter="url(#ai-shadow-unique)"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">Ai</text>
    </svg>
  );
}