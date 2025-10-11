
import React from 'react';
import Icon from './Icon';

interface CheckboxProps {
  label: React.ReactNode;
  id: string;
  name?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: boolean;
  required?: boolean;
  hasError?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  name = '',
  disabled = false,
  value = undefined,
  onChange = () => {},
  defaultChecked = false,
  required = false,
  hasError = false,
  className,
}) => {
  const errorClass = hasError ? 'text-red-700' : 'text-gray-200';

  return (
    <div className={`opacity-${disabled ? 50 : 100} ${disabled ? 'pointer-events-none' : ''} ${className}`}>
      <input
        hidden
        type="checkbox"
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        onChange={onChange}
        className="hidden"
      />
      <label htmlFor={id} className="flex items-center cursor-pointer gap-2 text-sm">
        <div className={`flex items-center justify-center self-start w-6 h-6 border-2 rounded transition-colors duration-300 linear ${errorClass} peer-checked:bg-green-700 peer-checked:text-green-700`}>
          <Icon name="check" className="text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300 linear" />
        </div>
        {label && <div>{label}</div>}
      </label>
    </div>
  );
};

export default Checkbox;
