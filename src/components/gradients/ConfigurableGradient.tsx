import React from 'react';
import './ConfigurableGradient.css';

interface ConfigurableGradientProps {
  children: React.ReactNode;
  color1: string;
  x1: number;
  y1: number;
  color2: string;
  x2: number;
  y2: number;
  color3: string;
  x3: number;
  y3: number;
  color4: string;
  x4: number;
  y4: number;
  baseColor: string;
  className?: string
}

const ConfigurableGradient: React.FC<ConfigurableGradientProps> = ({
  children,
  color1,
  x1,
  y1,
  color2,
  x2,
  y2,
  color3,
  x3,
  y3,
  color4,
  x4,
  y4,
  baseColor,
  className
}) => {
  const style = {
    '--color1': color1,
    '--x1': `${x1}%`,
    '--y1': `${y1}%`,
    '--color2': color2,
    '--x2': `${x2}%`,
    '--y2': `${y2}%`,
    '--color3': color3,
    '--x3': `${x3}%`,
    '--y3': `${y3}%`,
    '--color4': color4,
    '--x4': `${x4}%`,
    '--y4': `${y4}%`,
    '--base-color': baseColor,
  } as React.CSSProperties;

  return (
    <div className={`configurable-gradient-container${className ? ' ' + className : ''}`} style={style}>
      {children}
    </div>
  );
};

export default ConfigurableGradient;
