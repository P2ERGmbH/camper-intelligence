
import React, { useState } from 'react';
import Loading from './Loading';
import InfoBadge from './InfoBadge';
import DetailsAddonBottomSheet from './DetailsAddonBottomSheet';
import DetailsAddon from './DetailsAddon';
import DetailsBadge from './DetailsBadge';
import DetailsSection from './DetailsSection';

interface Option {
  optionIndex: number;
  label: string;
  mandatory?: boolean;
  price?: string;
  disabled?: boolean;
  selected?: boolean;
  value: number;
}

interface AddonItem {
  id: string;
  name: string;
  addonIndex: number;
  // Add other properties from DetailsAddonProps if needed
  description: string;
  image?: { src: string; };
  info?: string[];
  required?: string[];
  label: string;
  options: Option[];
  type: string;
  totalPrice?: number;
  isLoading?: boolean;
  isFetching?: boolean;
}

interface AddonSection {
  addons: AddonItem[];
  headline: string;
  itemIndex: number;
}

interface DetailsAddonsProps {
  addons: AddonSection[];
  onChange: (id: string, value: { id: string; quantity: number; price: number; } | number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  price?: number;
}

const DetailsAddons: React.FC<DetailsAddonsProps> = ({ addons, onChange, isLoading, isFetching, price }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [currentAddonIndex, setCurrentAddonIndex] = useState({ item: 0, addon: 0 });

  if (isLoading && !addons?.length) {
    return <Loading height="400px" />;
  }

  if (!addons?.length) {
    return (
      <div className="flex flex-col items-center text-center">
        <InfoBadge background="var(--yellow-700)" withSpacing>Info</InfoBadge>
        <div>No add-ons available for the selected period and location.</div>
      </div>
    );
  }

  return (
    <DetailsSection>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100 to-transparent"></div>
      <DetailsBadge>Add Extras</DetailsBadge>
      <div className="relative flex flex-col gap-20">
        {addons.map(({ addons: addonSection, headline, itemIndex }: AddonSection) => (
          <div key={`addonSection${itemIndex}`}>
            <div>
              <h3 className="font-bold text-xl">{headline}</h3>
            </div>
            <div className="gap-3">
              {addonSection.map((addon: AddonItem) => (
                <DetailsAddon
                  key={addon.name}
                  totalPrice={price}
                  onChange={onChange}
                  onChecked={() => {}}
                  {...addon}
                  isLoading={isLoading}
                  isFetching={isFetching}
                  onInfoClick={() => {
                    setOpenSidebar(true);
                    setCurrentAddonIndex({ item: itemIndex, addon: addon.addonIndex });
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <DetailsAddonBottomSheet
        isFetching={isFetching}
        addon={addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon] ? { ...addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon], image: { src: addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon]?.image?.src || '' }, label: addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon]?.label || addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon]?.name || '', description: addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon]?.description || '', type: addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon]?.type || '', options: addons[currentAddonIndex.item]?.addons[currentAddonIndex.addon]?.options || [] } : undefined}
        onChange={onChange}
        isOpen={openSidebar}
        onCloseRequest={() => setOpenSidebar(false)}
      />
    </DetailsSection>
  );
};

export default DetailsAddons;
