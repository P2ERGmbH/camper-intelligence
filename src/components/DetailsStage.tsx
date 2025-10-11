
import React, { useState } from 'react';
import Lightbox from './Lightbox';
import Slider from './Slider';
import Image from './Image';
import Button from './Button';

interface Image {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface DetailsStageProps {
  images?: Image[];
}

const DetailsStage: React.FC<DetailsStageProps> = ({ images }) => {
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!images || images.length <= 0) {
    return null;
  }

  return (
    <div className="relative">
      {images && (
        <Lightbox
          isOpen={imageGalleryOpen}
          onCloseRequest={() => setImageGalleryOpen(false)}
        >
          <Slider loop defaultActiveSlide={activeSlide}>
            {images.map(({ src, alt, width, height }) => (
              <div key={src} className="h-full">
                <Image src={src} alt={alt} width={width} height={height} className="object-contain h-full w-full" />
              </div>
            ))}
          </Slider>
        </Lightbox>
      )}
      <div className="md:grid md:gap-4 md:grid-cols-[7fr_3fr]">
        <div className="border border-gray-200 cursor-pointer -mx-4 md:mx-0">
          <div onClick={() => { setActiveSlide(0); setImageGalleryOpen(true); }}>
            <Image src={images[0].src} alt={images[0]?.alt} width={images[0]?.width} height={images[0]?.height} loading="eager" className="rounded" />
          </div>
        </div >
        <div className="hidden md:grid gap-4">
          <div onClick={() => { setActiveSlide(1); setImageGalleryOpen(true); }} className="cursor-pointer">
            {images[1] && <Image src={images[1].src} alt={images[1].alt} width={images[1].width} height={images[1].height} loading="eager" className="rounded" />}
          </div>
          <div onClick={() => { setActiveSlide(2); setImageGalleryOpen(true); }} className="cursor-pointer">
            {images[2] && <Image src={images[2].src} alt={images[2].alt} width={images[2].width} height={images[2].height} loading="eager" className="rounded" />}
          </div>
        </div >
      </div >
      <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6">
        <Button
          onClick={() => setImageGalleryOpen((prevState) => !prevState)}
          className="bg-gray-700 text-white text-sm"
        >
          Show all photos
        </Button>
      </div>
    </div >
  );
};

export default DetailsStage;
