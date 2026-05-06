interface FigmaIconProps {
  className?: string;
  size?: number;
}

export default function FigmaIcon({ className = "", size = 24 }: FigmaIconProps) {
  return (
    <img 
      src="/figma-seeklogo.png" 
      alt="Figma" 
      width={size} 
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
