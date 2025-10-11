
import React from 'react';
import Icon, { IconSizes } from './Icon';

interface InfoButtonProps {
  onClick?: () => void;
  iconSize?: string | number;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick = () => {}, iconSize = IconSizes.M }) => {
  return (
    <div onClick={onClick} tabIndex={0} role="button" className="ml-2">
      <Icon name={'info'} size={iconSize} />
    </div>
  );
};

export default InfoButton;
