interface AdobeIllustratorIconProps {
  className?: string;
  size?: number;
}

export default function AdobeIllustratorIcon({ className = "", size = 24 }: AdobeIllustratorIconProps) {
  return (
    <img 
      src="/adobe-illustrator-seeklogo.png" 
      alt="Adobe Illustrator" 
      width={size} 
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
