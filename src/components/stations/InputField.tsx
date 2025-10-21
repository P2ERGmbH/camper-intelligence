'use client';

import React, { useRef } from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  rows?: number;
  initialValue?: string | number;
}

export default function InputField({
  label,
  id,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  rows,
  initialValue,
}: InputFieldProps) {
  const isTextArea = type === 'textarea';
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasChanged = initialValue !== undefined && value !== initialValue;

  return (
    <div ref={containerRef} className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[319px]">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative w-full">
        {hasChanged && (
          <div
            className="absolute z-10 top-1 left-3 text-xs text-red-500 line-through truncate w-[calc(100%-24px)] pointer-events-none"
          >
            {initialValue?.toString()}
          </div>
        )}
        {isTextArea ? (
          <textarea
            name={name}
            id={id}
            value={value as string}
            onChange={onChange}
            rows={rows}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm min-h-[50px]"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm min-h-[50px]"
          />
        )}
      </div>
    </div>
  );
}
