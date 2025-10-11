
import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  inheritColor?: boolean;
  isDisabled?: boolean;
  isBold?: boolean;
  isUnderlined?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  inheritColor = false,
  isDisabled = false,
  isBold = false,
  isUnderlined = true,
  children,
  ...props
}) => {
  const colorClass = isDisabled ? 'text-gray-300' : inheritColor ? 'text-current' : 'text-green-600 hover:text-green-800';
  const fontWeightClass = isBold ? 'font-bold' : 'font-normal';
  const textDecorationClass = isUnderlined ? 'border-b border-green-800 hover:border-transparent' : 'border-b-0';

  return (
    <a
      className={`cursor-pointer transition-colors duration-200 ease-out ${colorClass} ${fontWeightClass} ${textDecorationClass}`}
      {...props}
    >
      {children}
    </a>
  );
};

interface LinkButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  inheritColor?: boolean;
  isDisabled?: boolean;
  isBold?: boolean;
  isUnderlined?: boolean;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  inheritColor = false,
  isDisabled = false,
  isBold = false,
  isUnderlined = true,
  children,
  ...props
}) => {
  const colorClass = isDisabled ? 'text-gray-300' : inheritColor ? 'text-current' : 'text-green-600 hover:text-green-800';
  const fontWeightClass = isBold ? 'font-bold' : 'font-normal';
  const textDecorationClass = isUnderlined ? 'border-b border-green-800 hover:border-transparent' : 'border-b-0';

  return (
    <div
      className={`cursor-pointer transition-colors duration-200 ease-out ${colorClass} ${fontWeightClass} ${textDecorationClass}`}
      {...props}
    >
      {children}
    </div>
  );
};
