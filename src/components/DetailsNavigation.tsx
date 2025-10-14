
import React from 'react';
import Icon, { IconSizes } from './Icon';
import { Link, LinkButton } from './Link';

interface SectionRefs {
  summary: React.RefObject<HTMLDivElement | null>;
  addons: React.RefObject<HTMLDivElement | null>;
  specs: React.RefObject<HTMLDivElement | null>;
  reviews: React.RefObject<HTMLDivElement | null>;
  rental: React.RefObject<HTMLDivElement | null>;
}

interface DetailsNavigationProps {
  sections: SectionRefs;
  onClick: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

const DetailsNavigation: React.FC<DetailsNavigationProps> = ({ sections, onClick }) => {
  const navigationItems = [
    { id: 'summary', label: 'Summary' },
    { id: 'addons', label: 'Add-ons' },
    { id: 'specs', label: 'Specs' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'rental', label: 'Rental' },
  ];

  return (
    <div className="sticky top-0 bg-white shadow-md z-10">
      <div className="px-4 md:px-8 lg:px-16">
        <div className="overflow-auto flex justify-between gap-2 md:gap-12 -mx-4 -mb-8 px-4 md:mx-0 md:px-0 md:-mb-8">
          <div className="flex py-3 gap-2">
            <Link href="/results" inheritColor isBold isUnderlined={false}>
              <Icon name="arrow-left" size={IconSizes.S} />
              <small className="whitespace-nowrap">Result List</small>
            </Link>
          </div>
          <div className="flex md:gap-6">
            {navigationItems.map(({ id, label }) => (
              <div key={id} className="text-gray-500">
                <LinkButton
                  inheritColor
                  isUnderlined={false}
                  role="button"
                  tabIndex={0}
                  onClick={() => onClick(sections[id as keyof SectionRefs])}
                  className="p-3"
                >
                  <small className="whitespace-nowrap">{label}</small>
                </LinkButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsNavigation;
