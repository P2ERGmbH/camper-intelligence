
import React from 'react';
import BottomSheet from './BottomSheet';
import DetailsAddonOptions from './DetailsAddonOptions';
import { DetailsAddonImage } from './DetailsAddonImage';

interface Option {
  selected?: boolean;
  hint?: string;
  calculated?: number;
  // Add other option properties
}

interface Addon {
  image: { src: string };
  label: string;
  description: string;
  id: string;
  type: string;
  options: Option[];
}

interface DetailsAddonBottomSheetProps {
  addon?: Addon;
  onChange: (id: string, value: { id: string; quantity: number; price: number; } | number) => void;
  isOpen: boolean;
  onCloseRequest: () => void;
  isFetching?: boolean;
}

const DetailsAddonBottomSheet: React.FC<DetailsAddonBottomSheetProps> = ({
  addon,
  onChange,
  isOpen,
  onCloseRequest,
  isFetching,
}) => {
  return (
    <BottomSheet
      onCloseRequest={onCloseRequest}
      isOpen={isOpen}
      title="Details"
    >
      {addon && (
        <div className="flex flex-col justify-center items-center">
          <DetailsAddonImage src={addon.image.src} alt={addon.label} className="h-64 w-64" />
          <div className="flex-auto w-full">
            <h3 className="font-bold text-xl">{addon.label}</h3>
            <div className="whitespace-pre-wrap my-4">{addon.description}</div>
            <DetailsAddonOptions
              id={addon.id}
              isFetching={isFetching}
              options={addon.options}
              onChange={onChange}
              isInsurance={addon.type === 'insurance'}
            />
          </div>
        </div>
      )}
    </BottomSheet>
  );
};

export default DetailsAddonBottomSheet;
