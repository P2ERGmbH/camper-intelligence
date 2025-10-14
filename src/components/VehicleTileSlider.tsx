
import React from 'react';
import Slider, { Slide } from './Slider';
import Image from './Image';
import Icon from './Icon';
import Button from './Button';

interface Image {
  src: string;
  alt?: string;
}

interface Vehicle {
  name?: string;
  max_adults?: number;
  max_children?: number;
}

interface VehicleTileSliderProps {
  distance?: number;
  distanceUnit?: string;
  images: Image[];
  moodImage?: Image;
  onFavourite?: () => void;
  isFavourite?: boolean;
  enableFavoriteFeature?: boolean;
  activeSlide?: number;
  vehicle?: Vehicle;
  onSlideChange?: (slide: number) => void;
}

const VehicleTileSlider: React.FC<VehicleTileSliderProps> = ({
  distance,
  distanceUnit,
  images,
  moodImage,
  onFavourite,
  isFavourite,
  enableFavoriteFeature = true,
  activeSlide = 0,
  vehicle,
  onSlideChange = () => {},
}) => {
  return (
    <div className="relative p-2 rounded-2xl">
      <Slider loop defaultActiveSlide={activeSlide} onSlideChange={onSlideChange}>
        {images && (
          <Slide>
            <div className="relative w-full">
              {distance && (
                <div className="absolute top-4 left-4 py-1.5 px-2 flex items-center gap-1 rounded-2xl bg-white shadow-lg text-xs">
                  <div className="relative h-3.5 w-3.5 p-0.5 rounded-full shadow-lg">
                    <div className="w-full h-full rounded-full bg-red-700"></div>
                  </div>
                  <span>{distance.toLocaleString()} {distanceUnit}</span>
                </div>
              )}
              {enableFavoriteFeature && (
                <Button
                  onClick={onFavourite || (() => {})}
                  className={`absolute top-4 right-4 p-1.5 h-auto rounded-full bg-gray-100 text-gray-600 shadow-lg ${isFavourite ? 'text-red-700' : ''}`}
                >
                  <Icon name={isFavourite ? "nav-heart-filled" : "nav-heart"} size={20} />
                </Button>
              )}
              <Image src={moodImage?.src || images[0].src} alt={moodImage?.alt || vehicle?.name || "Camper image"} className="w-full h-auto rounded-none" />
              <div className="absolute bottom-14 w-full h-14 bg-gradient-to-t from-black to-transparent opacity-35"></div>
              <div className="absolute bottom-0 w-full h-14">
                <Image src={moodImage?.src || images[0].src} alt={moodImage?.alt || vehicle?.name || "Camper image blurred background"} className="absolute bottom-0 object-cover filter blur-2xl scale-125 -translate-y-1/4 w-full h-auto" />
                <div className="relative h-full bg-black bg-opacity-35 text-white grid grid-cols-3 justify-between items-center border-t border-white">
                  <div className="w-full flex flex-row p-4 items-center text-sm">
                    <Image src="/path/to/adult-kid.svg" alt="Adult and kid icon" className="max-w-6 mr-1" />
                    <span>{vehicle?.max_adults || 0}/{vehicle?.max_children || 0} Max</span>
                  </div>
                  {/* Other highlights */}
                </div>
              </div>
            </div>
          </Slide>
        )}
        {/* Other slides */}
      </Slider>
    </div>
  );
};

export default VehicleTileSlider;
