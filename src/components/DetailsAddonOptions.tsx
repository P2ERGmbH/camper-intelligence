
import React from 'react';
import AddonOption from './AddonOption';

import { Option } from '@/types/addon';
interface DetailsAddonOptionsProps {
  options: Option[];
  id: string;
  isInsurance?: boolean;
  onChange: (id: string, selectedValue: { id: string; quantity: number; price: number; } | number) => void;
  isFetching?: boolean;
}

const DetailsAddonOptions: React.FC<DetailsAddonOptionsProps> = ({
  options,
  id,
  isInsurance,
  onChange,
  isFetching,
}) => {
  return (
    <div
      role="listbox"
      className={`grid grid-cols-3 gap-2 ${isFetching ? 'pointer-events-none animate-pulse' : ''}`}
    >
      {options.map(
        ({
          optionIndex,
          label,
          mandatory,
          price,
          disabled,
          selected,
          value,
        }) => (
          <AddonOption
            label={label}
            mandatory={mandatory}
            price={price}
            disabled={disabled}
            selected={selected}
            isInsurance={isInsurance}
            key={optionIndex}
            value={value}
            onChange={(selectedValue) => {
              if (typeof selectedValue === 'string') {
                onChange(id, { id: selectedValue, quantity: 1, price: 0 });
              } else if (typeof selectedValue === 'number') {
                onChange(id, selectedValue);
              }
            }}
          />
        ),
      )}
    </div>
  );
};

export default DetailsAddonOptions;
