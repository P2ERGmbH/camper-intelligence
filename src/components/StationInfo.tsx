
import React from 'react';
import Icon, { IconSizes } from './Icon';

interface StationInfoProps {
  station?: {
    description?: string;
    weekday_text_monday?: string;
    weekday_text_saturday?: string;
    weekday_text_sunday?: string;
    weekday_text_holiday?: string;
    street?: string;
    postal_code?: string;
    administrative_area_level_2?: string;
    phone_number?: string;
    hotline_number?: string;
    weekday_text_info?: string;
  };
  className?: string;
}

const StationInfo: React.FC<StationInfoProps> = ({ station, className }) => {
  if (!station) {
    return null;
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-col gap-8 my-12">
        {station.description && <div className="text-gray-500 whitespace-pre-wrap">{station.description}</div>}
        <div className="flex flex-row">
          <div className="mt-1 mr-2">
            <Icon name="clock" size={IconSizes.M} />
          </div>
          <div className="flex flex-col mr-auto">
            <div className="font-bold">Opening Hours</div>
            <div className="grid grid-cols-2 gap-x-4">
              <div>Mo. - Fr.</div>
              <div>{station.weekday_text_monday}</div>
              <div>Saturday</div>
              <div>{station.weekday_text_saturday}</div>
              <div>Sunday</div>
              <div>{station.weekday_text_sunday}</div>
              <div>Holiday</div>
              <div>{station.weekday_text_holiday}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mt-1 mr-2">
            <Icon name="map-pin" size={IconSizes.M} />
          </div>
          <div className="flex flex-col mr-auto">
            <div className="font-bold">Address</div>
            <div>{station.street}</div>
            <div>{`${station.postal_code} ${station.administrative_area_level_2}`}</div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mt-1 mr-2">
            <Icon name="phone" size={IconSizes.M} />
          </div>
          <div className="flex flex-col mr-auto">
            <div className="font-bold">Telephone</div>
            <div>{station.phone_number}</div>
            {station.hotline_number && <div>{station.hotline_number}</div>}
          </div>
        </div>
      </div>
      {station.weekday_text_info && (
        <div className="flex flex-row mb-8">
          <div className="mt-1 mr-2">
            <Icon name="info" size={IconSizes.M} />
          </div>
          <div className="flex flex-col">
            <div>{station.weekday_text_info}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationInfo;
