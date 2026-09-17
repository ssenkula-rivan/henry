export default function BlenderIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="blender-gradient-new" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5792A" />
          <stop offset="100%" stopColor="#E35B18" />
        </linearGradient>
        <filter id="blender-shadow-new" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="6" fill="url(#blender-gradient-new)" filter="url(#blender-shadow-new)"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">Bl</text>
    </svg>
  );
}