interface BlenderIconProps {
  className?: string;
  size?: number;
}

export default function BlenderIcon({ className = "", size = 24 }: BlenderIconProps) {
  return (
    <img 
      src="/blender-seeklogo.png" 
      alt="Blender" 
      width={size} 
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
