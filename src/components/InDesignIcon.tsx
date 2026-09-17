export default function InDesignIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="id-gradient-final" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#C60055" />
        </linearGradient>
        <filter id="id-shadow-final" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="6" fill="url(#id-gradient-final)" filter="url(#id-shadow-final)"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">Id</text>
    </svg>
  );
}