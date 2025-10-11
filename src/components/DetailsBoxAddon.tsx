
import React from 'react';
import { Link } from './Link';
import { DetailsAddonImage } from './DetailsAddonImage';

interface Thumbnail {
  src: string;
}

interface LinkData {
  href: string;
  label: string;
}

interface DetailsBoxAddonProps {
  label?: string;
  thumbnail?: Thumbnail;
  price?: string;
  amount?: number;
  subheading?: string;
  link?: LinkData;
}

const DetailsBoxAddon: React.FC<DetailsBoxAddonProps> = ({
  label,
  thumbnail,
  price,
  amount,
  subheading,
  link,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-16">
        {thumbnail && thumbnail.src && <DetailsAddonImage src={thumbnail.src} />}
      </div>
      <div className="flex-auto flex items-center justify-between">
        <div>
          {subheading && <small>{subheading}</small>}
          {label && <div className="text-sm md:text-base font-bold truncate">{label}</div>}
          {link && (
            <Link href={link.href} isBold isUnderlined={false}>
              <small>{link.label}</small>
            </Link>
          )}
        </div>
        <div className="text-right">
          {price && <small className="font-bold">{price}</small>}
          {amount && <small className="whitespace-nowrap">Amount: <span>{amount}</span></small>}
        </div>
      </div>
    </div>
  );
};

export default DetailsBoxAddon;
