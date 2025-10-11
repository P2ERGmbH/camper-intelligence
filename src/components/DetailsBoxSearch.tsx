
import React from 'react';
import TripInformationTable from './TripInformationTable';

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

interface DetailsBoxSearchProps {
  locations?: Locations;
  dates?: Dates;
  participants?: Participants;
}

const DetailsBoxSearch: React.FC<DetailsBoxSearchProps> = ({ locations, dates, participants }) => {
  return (
    <div className="p-4 rounded-lg bg-white shadow-lg">
      <TripInformationTable
        locations={locations}
        dates={dates}
        participants={participants}
      />
    </div>
  );
};

export default DetailsBoxSearch;
