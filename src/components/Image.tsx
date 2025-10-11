
import NextImage from 'next/image';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const Image: React.FC<ImageProps> = ({ src, alt = '', width, height, ...props }) => {
  return <NextImage src={src} alt={alt} width={width} height={height} {...props} />;
};

export default Image;
