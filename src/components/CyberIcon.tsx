import React from 'react';
import * as Icons from 'lucide-react';

interface CyberIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: string;
  className?: string;
  size?: number | string;
}

export const CyberIcon: React.FC<CyberIconProps> = ({ name, className = '', size = 20, ...props }) => {
  // Safe lookup in Lucide Icons list
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number | string }>>)[name] || Icons.HelpCircle;
  
  return <IconComponent className={className} size={size} {...props} />;
};
