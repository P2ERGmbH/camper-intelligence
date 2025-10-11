
import React from 'react';
import Image from './Image';

interface DetailsSpecsFloorplanProps {
  src?: string;
  width?: number;
  height?: number;
}

const DetailsSpecsFloorplan: React.FC<DetailsSpecsFloorplanProps> = ({ src, width, height }) => {
  if (!src) return null;

  return (
    <div className="h-full absolute top-0 left-4 w-full" style={{ clip: 'rect(0, auto, auto, 0)' }}>
      <div className="h-full max-h-[calc(100vh-200px)] fixed top-1/2 -translate-y-1/2 w-[calc(50vw-32px)] lg:ml-4 lg:top-1/2 lg:w-[calc(30vw-36px)] xl:max-w-[317px]">
        <Image src={src} alt="Floorplan" width={width} height={height} className="object-contain -translate-y-1/2" />
      </div>
    </div>
  );
};

export default DetailsSpecsFloorplan;
