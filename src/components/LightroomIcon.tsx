export default function LightroomIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="lr-gradient-unique" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#689F38" />
        </linearGradient>
        <filter id="lr-shadow-unique" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="6" fill="url(#lr-gradient-unique)" filter="url(#lr-shadow-unique)"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">Lr</text>
    </svg>
  );
}