
import React from 'react';
import Accordion from './Accordion';
import StationHeader from './StationHeader';
import StationInfo from './StationInfo';

interface Station {
  city?: string;
  lat?: number;
  lng?: number;
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
}

interface DetailsStationProps {
  station?: Station;
  expand?: boolean;
  headline?: string;
}

const DetailsStation: React.FC<DetailsStationProps> = ({
  station,
  expand = false,
  headline = "Takeover Station",
}) => {
  return (
    <Accordion
      label={<div>
        <h3 className="text-lg font-bold">{headline}</h3>
        <div>{station?.city}</div>
      </div>}
      expand={expand}
      colorChange={false}
    >
      <StationHeader station={station} />
      <StationInfo station={station} />
    </Accordion>
  );
};

export default DetailsStation;
