
import React from 'react';
import Image from './Image';

interface DetailsAddonImageProps {
  className?: string;
  src?: string;
  alt?: string;
}

export const DetailsAddonImage: React.FC<DetailsAddonImageProps> = ({ className, src, alt }) => {
  return (
    <Image
      className={className}
      height={1}
      width={1}
      objectFit="contain"
      src={src || "https://img.cu-camper.com/img/cu/camper/addons/icons/placeholder.520x.jpg"}
      alt={alt}
    />
  );
};
