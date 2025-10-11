
import React, { useEffect, useState } from 'react';

interface AddonOptionProps {
  label?: string;
  value?: string | number;
  mandatory?: boolean;
  price?: string;
  disabled?: boolean;
  selected?: boolean;
  isInsurance?: boolean;
  onChange?: (selectedValue: string | number | undefined) => void;
}

const AddonOption: React.FC<AddonOptionProps> = ({
  label,
  value,
  mandatory,
  price,
  disabled,
  selected,
  isInsurance,
  onChange,
}) => {
  const [checked, setChecked] = useState(selected || mandatory);

  useEffect(() => {
    if (disabled) {
      setChecked(false);
    } else {
      setChecked(selected || mandatory);
    }
  }, [selected, mandatory, disabled]);

  const colorClass = checked ? (isInsurance ? 'text-blue-500' : 'text-green-700') : '';
  const borderColorClass = checked ? 'border-current' : 'border-gray-200';
  const pointerEventsClass = disabled || mandatory || checked ? 'pointer-events-none' : '';

  return (
    <div
      onClick={() => {
        setChecked(true);
        if (onChange) {
          onChange(value);
        }
      }}
      role="button"
      tabIndex={0}
      className={`relative flex flex-col justify-center items-center flex-auto gap-1 h-16 md:h-20 rounded border transition-all duration-200 linear cursor-pointer ${colorClass} ${borderColorClass} ${pointerEventsClass}`}
    >
      <div className={`absolute top-0 left-0 w-full h-full bg-current transition-opacity duration-200 linear ${checked ? 'opacity-10' : 'opacity-0'}`}></div>
      <div className={`font-bold leading-none ${disabled ? 'text-gray-300' : 'text-current'}`}>{label}</div>
      <small className={`transition-all duration-200 ease-in-out ${checked ? 'max-h-0 opacity-0' : 'max-h-4 opacity-50'} ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
        {price}
      </small>
    </div>
  );
};

export default AddonOption;
