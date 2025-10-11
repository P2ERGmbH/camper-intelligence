
import React from 'react';
import Image from './Image';

export const VehicleAvailabilityRounding = {
  LEFT: 'left',
  RIGHT: 'right',
  ALL: 'all',
  NONE: 'none',
};

interface VehicleAvailabilityProps {
  avail?: {
    FS?: boolean;
    RQ?: boolean;
    NA?: boolean;
  };
  rounding?: string;
  circle?: boolean;
}

const VehicleAvailability: React.FC<VehicleAvailabilityProps> = ({
  avail = {
    FS: false,
    RQ: false,
    NA: false,
  },
  rounding = VehicleAvailabilityRounding.ALL,
  circle = false,
}) => {
  let color = 'text-gray-700';
  let bgColor = 'bg-gray-700';
  let label = 'Checking';
  let circleIcon = '';

  if (avail.FS) {
    color = 'text-white';
    bgColor = 'bg-green-700';
    label = 'Available';
    circleIcon = '/path/to/available.svg';
  } else if (avail.RQ) {
    color = 'text-white';
    bgColor = 'bg-yellow-900';
    label = 'On request';
    circleIcon = '/path/to/on-request.svg';
  } else if (avail.NA) {
    color = 'text-white';
    bgColor = 'bg-red-900';
    label = 'Booked out';
    circleIcon = '/path/to/not-available.svg';
  }

  if (circle) {
    bgColor = 'bg-transparent';
    if (avail.FS) color = 'text-green-700';
    else if (avail.RQ) color = 'text-yellow-900';
    else if (avail.NA) color = 'text-red-900';
  }

  const roundingClass = {
    [VehicleAvailabilityRounding.LEFT]: 'rounded-l-md',
    [VehicleAvailabilityRounding.RIGHT]: 'rounded-r-md',
    [VehicleAvailabilityRounding.ALL]: 'rounded-md',
    [VehicleAvailabilityRounding.NONE]: 'rounded-none',
  }[rounding];

  return (
    <div className={`flex flex-row py-1 px-2 text-xs font-bold ${roundingClass} ${bgColor} ${color}`}>
      {circle && <Image src={circleIcon} alt={label} className="h-4 w-auto" />}
      <small className="whitespace-nowrap overflow-hidden overflow-ellipsis">{label}</small>
    </div>
  );
};

export default VehicleAvailability;
