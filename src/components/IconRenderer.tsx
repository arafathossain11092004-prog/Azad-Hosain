import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export function IconRenderer({ name, className = '' }: IconRendererProps) {
  const Icon = (LucideIcons as any)[name];
  
  if (!Icon) {
    // If not found in lucide, let's render a fallback or a default icon.
    // Sometimes users misspell icon names, so fallback to 'Link' or similar.
    const DefaultIcon = LucideIcons.Link;
    return <DefaultIcon className={className} />;
  }
  
  return <Icon className={className} />;
}
