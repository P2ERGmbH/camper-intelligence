import React from 'react';
import Image from './Image';

interface StationHeaderProps {
  station?: {
    lat?: number;
    lng?: number;
  };
  headline?: string;
  subline?: string;
  topline?: string;
  image?: string;
  className?: string;
  onClick?: () => void;
}

const StationHeader: React.FC<StationHeaderProps> = ({
  station,
  headline,
  subline,
  topline,
  image,
  className,
  onClick,
}) => {
  let imageUrl = image;
  if (!imageUrl && station?.lat && station?.lng) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${station.lat},${station.lng}&zoom=9&size=640x360&maptype=terrain&markers=icon:https://www.cu-camper.com/wp-content/themes/cu-magazine-theme/assets/images/station-pin.png|${station.lat},${station.lng}&key=${apiKey}`;
  }

  return (
    <div className={`flex flex-col ${className}`} onClick={onClick}>
      {topline && <small>{topline}</small>}
      {headline && <h2 className="text-2xl font-bold">{headline}</h2>}
      <div className="w-full rounded-lg mb-8 overflow-hidden">
        {imageUrl && <Image src={imageUrl} alt={headline || "Station location map"} width={640} height={360} loading="lazy" />}
      </div>
      {subline && <h4 className="text-lg font-bold mb-5">{subline}</h4>}
    </div>
  );
};

export default StationHeader;