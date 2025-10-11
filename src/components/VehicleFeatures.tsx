
import React from 'react';
import SummaryItem from './SummaryItem';

interface Feature {
  name: string;
  icon: string;
  available: boolean;
}

interface VehicleFeaturesProps {
  list: Feature[];
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ list }) => {
  return (
    <div className="flex flex-wrap items-center mb-8">
      {list.map(({ available, icon, name }) => {
        if (!available) {
          return null;
        }
        return (
          <div key={name} className="flex-grow flex-shrink-0 basis-1/2 mb-2">
            <SummaryItem iconName={icon} iconSize="40" label={name} content="" />
          </div>
        );
      })}
    </div>
  );
};

export default VehicleFeatures;
