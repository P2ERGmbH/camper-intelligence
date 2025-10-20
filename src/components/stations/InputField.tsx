'use client';

import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  rows?: number;
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
}: InputFieldProps) {
  const isTextArea = type === 'textarea';

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[319px]">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          name={name}
          id={id}
          value={value as string}
          onChange={onChange}
          rows={rows}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      )}
    </div>
  );
}
