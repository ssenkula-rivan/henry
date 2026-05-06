interface AdobePhotoshopIconProps {
  className?: string;
  size?: number;
}

export default function AdobePhotoshopIcon({ className = "", size = 24 }: AdobePhotoshopIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="24" height="24" rx="3" fill="#31A8FF"/>
      
      {/* Ps text */}
      <text x="12" y="16" 
            fontFamily="Arial, sans-serif" 
            fontSize="11" 
            fontWeight="bold" 
            fill="white" 
            textAnchor="middle">
        Ps
      </text>
    </svg>
  );
}
