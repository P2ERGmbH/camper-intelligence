
import React, { useState } from 'react';
import Lightbox from './Lightbox';
import Slider from './Slider';
import Image from 'next/image'; // Changed to next/image
import { useTranslations } from 'next-intl'; // Import useTranslations

interface ImageProps { // Renamed to ImageProps to avoid conflict with global Image
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface DetailsStageProps {
  images?: ImageProps[];
  onAddImage?: () => void; // New prop for adding images
}

const DetailsStage: React.FC<DetailsStageProps> = ({ images, onAddImage }) => {
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const t = useTranslations('camperDetails'); // Initialize useTranslations

  if (!images || images.length <= 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setActiveSlide(index);
    setImageGalleryOpen(true);
  };

  return (
    <div className="relative">
      {images && (
        <Lightbox
          isOpen={imageGalleryOpen}
          onCloseRequest={() => setImageGalleryOpen(false)}
        >
          <Slider loop defaultActiveSlide={activeSlide}>
            {images.map(({ src, alt, width, height }, index) => (
              <div key={src} className="h-full">
                <Image src={src} alt={alt || `Camper image ${index + 1}`} width={width || 768} height={height || 432} className="object-contain h-full w-full" />
              </div>
            ))}
          </Slider>
        </Lightbox>
      )}
      <div className="flex overflow-x-auto space-x-4 p-4 hide-scrollbar"> {/* Horizontally scrollable container */}
        {images.map((image, index) => (
          <div
            key={image.src}
            className="flex-none w-80 h-48 relative cursor-pointer rounded-lg overflow-hidden" // Fixed size for each image
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={image.src}
              alt={image.alt || `Camper image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
        {onAddImage && (
          <div className="flex-none w-80 h-48 relative border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer" onClick={onAddImage}>
            <Image src="/public/assets/svg/uil-plus-circle.svg" alt="Add image" width={48} height={48} />
            <span className="ml-2 text-gray-600">{t('addImage')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsStage;
