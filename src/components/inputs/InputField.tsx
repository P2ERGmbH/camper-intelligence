'use client';

import React, { useRef } from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  rows?: number;
  initialValue?: string | number;
  icon?: React.ReactNode;
  selectOptions?: { value: string; label: string }[];
}

export default function InputField({
                                     label,
                                     id,
                                     name,
                                     value,
                                     disabled,
                                     onChange,
                                     type = 'text',
                                     placeholder,
                                     rows,
                                     initialValue,
                                     icon,
                                     selectOptions,
                                   }: InputFieldProps) {
  const isTextArea = type === 'textarea';
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasChanged = initialValue !== undefined && value !== initialValue;

  const inputOffset = hasChanged ? "pb-1 pt-3": "py-2";
  const inputClasses = "block w-full px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm min-h-[50px] transition-all " + inputOffset;
  const inputWithIconClasses = icon ? "pl-[44px]" : "";

  return (
      <div ref={containerRef} className={"w-full content-stretch flex flex-col gap-[8px] items-start relative shrink-0"}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className={"relative w-full mt-1"  + (disabled ? " opacity-50 pointer-events-none": "")}>
          {hasChanged && (
              <div
                  className="absolute z-10 pt-1 px-4 text-sm text-gray-500 line-through truncate w-[calc(100%-24px)] pointer-events-none"
              >
                {initialValue?.toString()}
              </div>
          )}
          {icon && (
              <div className={`absolute left-0 pl-3 flex items-center pointer-events-none`}>
                {icon}
              </div>
          )}
          {selectOptions ? (
              <select
                  name={name}
                  id={id}
                  value={value}
                  onChange={onChange}
                  ref={inputRef as React.RefObject<HTMLSelectElement>}
                  className={inputClasses + " " + inputWithIconClasses}
              >
                {selectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                ))}
              </select>
          ) : isTextArea ? (
              <textarea
                  name={name}
                  id={id}
                  value={value as string}
                  onChange={onChange}
                  rows={rows}
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  className={inputClasses + " " + inputWithIconClasses + " min-h-[50px]"}
              />
          ) : (
              <input
                  type={type}
                  name={name}
                  id={id}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  className={inputClasses + " " + inputWithIconClasses + " min-h-[50px]"}
              />
          )}
        </div>
      </div>
  );
}