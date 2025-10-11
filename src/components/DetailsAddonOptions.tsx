
import React from 'react';
import AddonOption from './AddonOption';

interface Option {
  optionIndex: number;
  label: string;
  mandatory?: boolean;
  price?: string;
  disabled?: boolean;
  selected?: boolean;
  value: number;
}

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
            onChange={(selectedValue) => onChange(id, selectedValue)}
          />
        ),
      )}
    </div>
  );
};

export default DetailsAddonOptions;
