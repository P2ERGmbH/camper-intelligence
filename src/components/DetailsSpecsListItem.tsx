
import React from 'react';
import Icon from './Icon';
import { SpaceLine } from './SpaceLine';

interface Item {
  label?: string;
  value?: string;
  icon?: string;
}

interface DetailsSpecsListItemProps {
  item: Item;
}

const DetailsSpecsListItem: React.FC<DetailsSpecsListItemProps> = ({ item }) => {
  const { label, value, icon } = item;
  const isAvailable = !icon || icon === 'check';
  const color = isAvailable ? 'text-green-700' : 'text-red-700';

  return (
    <div className="flex gap-1 items-center">
      {icon && <Icon name={icon} size={32} color={color} className="flex-shrink-0 mr-2 md:mr-5 self-start" />}
      {label && <div className={`opacity-${isAvailable ? 100 : 40} ${!isAvailable ? 'line-through' : ''}`}>{label}</div>}
      {value && (
        <>
          <SpaceLine />
          <div>{value}</div>
        </>
      )}
    </div>
  );
};

export default DetailsSpecsListItem;
