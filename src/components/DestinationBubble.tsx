
import React from 'react';
import Icon from './Icon';

interface DestinationBubbleProps {
  stationLabel: string;
  stationCount: number;
  onClick: () => void;
}

const DestinationBubble: React.FC<DestinationBubbleProps> = ({ stationLabel, stationCount, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="absolute top-6 left-6 bg-white rounded-2xl py-1.5 px-2 flex flex-row justify-between cursor-pointer items-center shadow-md whitespace-nowrap"
    >
      <Icon name="cu-location-pin" size={20} />
      <small className="font-bold ml-1.5">{stationLabel}&nbsp;</small>
      <small>
        {stationCount !== 1 ? `+ ${stationCount - 1} more` : ``}
      </small>
      <Icon name="cu-dropdown" size={20} className="ml-2" />
    </div>
  );
};

export default DestinationBubble;
