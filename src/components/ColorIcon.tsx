
import React, { Suspense } from 'react';

const Adult = React.lazy(() => import('./icons/Adult'));

interface ColorIconProps {
  name: string;
  color?: string;
  color1?: string;
  color2?: string;
}

const iconMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = { // eslint-disable-line @typescript-eslint/no-explicit-any
  adult: Adult,
};

const ColorIcon: React.FC<ColorIconProps> = ({ name, color, color1, color2 }) => {
  const Icon = iconMap[name];

  if (!Icon) {
    console.warn(`Icon with name "${name}" not found.`);
    return null;
  }

  return (
    <div
      className="w-7 h-7"
      style={{
        '--color': color || 'currentColor',
        '--color1': color1 || 'currentColor',
        '--color2': color2 || 'currentColor',
      } as React.CSSProperties}
    >
      <Suspense fallback={<div>...</div>}>
        <Icon />
      </Suspense>
    </div>
  );
};

export default ColorIcon;
