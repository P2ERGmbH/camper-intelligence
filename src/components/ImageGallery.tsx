import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: ImageProps[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const mainImage = images[0];
  const thumbnails = images.slice(1, 5); // Display up to 4 thumbnails

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 rounded-lg overflow-hidden">
      <div className="relative md:col-span-2 md:row-span-2 h-full w-full">
        <Image
          src={mainImage.src}
          alt={mainImage.alt}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      {thumbnails.map((image, index) => (
        <div key={index} className="relative h-full w-full">
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          {index === thumbnails.length - 1 && images.length > 5 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
              <button className="text-white text-sm font-semibold px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/40 transition-colors">
                Show all photos ({images.length})
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
