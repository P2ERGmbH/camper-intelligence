
import React, { useState, useMemo } from 'react';
import DetailsInfoButton from './DetailsInfoButton';
import { DetailsAddonImage } from './DetailsAddonImage';
import DetailsAddonOptions from './DetailsAddonOptions';
import Checkbox from './Checkbox';

interface Image {
  src?: string;
}

import { Option } from '@/types/addon';
interface DetailsAddonProps {
  id: string;
  description?: string;
  image?: Image;
  info?: string[];
  required?: string[];
  label?: string;
  options?: Option[];
  type?: string;
  onChange?: (id: string, value: { id: string; quantity: number; price: number; } | number) => void;
  onChecked?: (id: string, checked: number) => void;
  onInfoClick?: () => void;
  isFetching?: boolean;
  totalPrice?: number;
  isLoading?: boolean;
}

const DetailsAddon: React.FC<DetailsAddonProps> = ({
  id,
  description,
  image,
  info = [],
  required = [],
  label,
  options = [],
  type,
  onChange = () => {},
  onChecked = () => {},
  onInfoClick = () => {},
  isFetching,
  totalPrice,
}) => {
  const isInsurance = type === 'insurance';
  const [checked, setChecked] = useState(0);

  const hint = useMemo(() => {
    const selectedOption = options.filter((option) => option.selected);
    const hintText = selectedOption.map((option) => option?.hint || '').join('\n');
    if (hintText && totalPrice) {
      return hintText
        .replace('{TOTAL_PRICE}', totalPrice.toString())
        .replace('{OPTION_PRICE}', `${Math.max(selectedOption[0]?.calculated || 0, (options[0]?.calculated || 0) * -1)}`);
    }
    return '';
  }, [options, totalPrice]);

  return (
    <div className={`relative rounded-lg shadow-lg p-6 md:p-8 my-4 bg-white flex gap-4 md:gap-6 ${isInsurance ? 'flex-col text-center md:flex-row md:text-left' : 'flex-row text-left'}`}>
      {description && <DetailsInfoButton onClick={onInfoClick} className="absolute top-2 right-2 md:top-4 md:right-4" />}
      <div className={`flex-shrink-0 ${isInsurance ? 'w-1/2 self-center md:self-start md:w-1/4' : 'w-1/4 self-start'}`}>
        <DetailsAddonImage src={image?.src || ''} alt={label} />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="font-bold text-base">{label}</div>
        {(info.length > 0 || required.length > 0) && (
          <div>
            {info.map((infoText, index) => (
              <div key={index} className="text-sm border-b border-gray-200 mb-3 pb-3 last:border-b-0">{infoText}</div>
            ))}
            {required.map((reqText, index) => (
              <div key={index} className="flex flex-row gap-2 text-sm">
                <Checkbox
                  id={`${id}required${index}`}
                  required
                  onChange={(e) => {
                    const newChecked = e.target.checked ? checked + 1 : checked - 1;
                    setChecked(newChecked);
                    onChecked(id, newChecked);
                    if (!e.target.checked) onChange(id, 0);
                  }}
                  label={reqText}
                />
              </div>
            ))}
          </div>
        )}
        <DetailsAddonOptions
          isFetching={isFetching}
          id={id}
          options={options}
          isInsurance={isInsurance}
          onChange={onChange}
        />
        {hint && <small>{hint}</small>}
      </div>
    </div>
  );
};

export default DetailsAddon;
