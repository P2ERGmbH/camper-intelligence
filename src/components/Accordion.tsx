import React, { useState } from 'react';

interface AccordionProps {
  children: React.ReactNode;
  label: React.ReactNode;
  expand?: boolean;
  colorChange?: boolean;
  className?: string;
  itemScope?: boolean;
  itemProp?: string;
  itemType?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  label,
  expand = false,
  colorChange = true,
  className,
  itemScope,
  itemProp,
  itemType,
}) => {
  const [expanded, setExpanded] = useState(expand);

  return (
    <section
      className={`border-t border-b border-gray-300 ${className}`}
      itemScope={itemScope}
      itemProp={itemProp}
      itemType={itemType}
    >
      <header
        className={`p-4 md:p-6 flex justify-between items-center cursor-pointer transition-colors duration-200 ease-out ${expanded && colorChange ? 'text-green-600' : ''} hover:text-green-600`}
        onClick={() => setExpanded(!expanded)}
      >
        {label}
        <div>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 14C23.1063 14 24 14.8938 24 16C24 17.1063 23.1063 18 22 18H10C8.89375 18 8 17.1063 8 16C8 14.8938 8.89375 14 10 14H22Z"
              fill="currentColor"
            />
            <path
              className="transform-origin-center transition-transform duration-200 ease-out"
              style={{ transform: expanded ? 'rotate(90deg)' : '' }}
              d="M18 22C18 23.1062 17.1062 24 16 24C14.8937 24 14 23.1062 14 22L14 10C14 8.89375 14.8937 8 16 8C17.1062 8 18 8.89375 18 10L18 22Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </header>
      <div
        className="grid transition-all duration-200 ease-out"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className={`p-4 md:px-6 md:pb-2 opacity-0 transform transition-opacity transition-transform duration-200 ease-out ${expanded ? 'opacity-100 translate-y-0' : '-translate-y-8'}`}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accordion;