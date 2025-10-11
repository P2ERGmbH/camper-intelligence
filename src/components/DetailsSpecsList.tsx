
import React from 'react';
import Icon from './Icon';
import DetailsSpecsListItem from './DetailsSpecsListItem';

interface Item {
  label: string;
  value: string;
  icon?: string;
}

interface List {
  icon: string;
  label: string;
  items: Item[];
}

interface DetailsSpecsListProps {
  list: List;
}

const DetailsSpecsList: React.FC<DetailsSpecsListProps> = ({ list }) => {
  const { icon, label, items } = list;
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex gap-4 items-center">
        <Icon name={icon} size={40} />
        <div className="font-bold">{label}</div>
      </div>
      {items.map((item) => (
        <DetailsSpecsListItem item={item} key={item.label + item.value} />
      ))}
    </div>
  );
};

export default DetailsSpecsList;
