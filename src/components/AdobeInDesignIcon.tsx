interface AdobeInDesignIconProps {
  className?: string;
  size?: number;
}

export default function AdobeInDesignIcon({ className = "", size = 24 }: AdobeInDesignIconProps) {
  return (
    <img 
      src="/adobe-indesign-seeklogo.png" 
      alt="Adobe InDesign" 
      width={size} 
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
