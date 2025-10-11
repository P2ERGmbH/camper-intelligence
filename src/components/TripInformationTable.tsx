
import React from 'react';
import Icon, { IconSizes } from './Icon';
import Loadable from './Loadable';

interface Location {
  name?: string;
}

interface Locations {
  from?: string | Location;
  to?: string | Location;
}

interface Dates {
  start?: string;
  end?: string;
}

interface Participants {
  amount?: number;
  label?: string;
}

interface TripInformationTableProps {
  locations?: Locations;
  dates?: Dates;
  participants?: Participants;
}

const TripInformationTable: React.FC<TripInformationTableProps> = ({ locations, dates, participants }) => {
  const fromLocation = typeof locations?.from === 'object' ? locations.from.name : locations?.from;
  const toLocation = typeof locations?.to === 'object' ? locations.to.name : locations?.to;

  return (
    <>
      <div className="grid gap-2 grid-cols-2 border-b border-gray-200 mb-4 pb-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon name="location-start" size={IconSizes.M} color="text-gray-500" />
          <small className="truncate">
            <Loadable placeholder="Takeover Location">{fromLocation}</Loadable>
          </small>
        </div>
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon name="location-end" size={IconSizes.M} color="text-gray-500" />
          <small className="truncate">
            <Loadable placeholder="Return Location">{toLocation}</Loadable>
          </small>
        </div>
      </div>
      <div className="grid gap-2 grid-cols-2 border-b border-gray-200 mb-4 pb-4">
        <div className="flex items-center gap-2">
          <Icon name="calendar-start" size={IconSizes.M} color="text-gray-500" />
          <small>
            <Loadable placeholder="DD.MM.YYYY">{dates?.start}</Loadable>
          </small>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="calendar-end" size={IconSizes.M} color="text-gray-500" />
          <small>
            <Loadable placeholder="DD.MM.YYYY">{dates?.end}</Loadable>
          </small>
        </div>
      </div>
      <div className="grid gap-2 grid-cols-2">
        <div className="flex items-center gap-2">
          <Icon name="username" size={IconSizes.M} color="text-gray-500" />
          <small>
            <Loadable placeholder="0 Travelers">
              {participants?.amount && `${participants?.amount} ${participants?.label}`}
            </Loadable>
          </small>
        </div>
      </div>
    </>
  );
};

export default TripInformationTable;
