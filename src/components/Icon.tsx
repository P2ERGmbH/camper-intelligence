
import React from 'react';

export const IconSizes = {
  XXS: 'xx-small',
  XS: 'x-small',
  S: 'small',
  M: 'medium',
  L: 'large',
  XL: 'x-large',
  XXL: 'xx-large',
};

interface IconProps {
  name: string;
  size?: string | number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name = '', size = IconSizes.M, color }) => {
  let width;

  switch (size) {
    case IconSizes.XXS:
      width = 8;
      break;
    case IconSizes.XS:
      width = 12;
      break;
    case IconSizes.S:
      width = 16;
      break;
    case IconSizes.M:
      width = 24;
      break;
    case IconSizes.L:
      width = 32;
      break;
    case IconSizes.XL:
      width = 48;
      break;
    case IconSizes.XXL:
      width = 64;
      break;
    default:
      width = size;
  }

  if (!name || typeof name !== 'string') {
    return null;
  }

  return (
    <svg
      className="relative flex fill-current pointer-events-none"
      style={{ width: `${width}px`, height: `${width}px`, color: color || 'inherit' }}
    >
      {/* Placeholder for SVG sprite */}
      <text>{name}</text>
    </svg>
  );
};

export default Icon;
