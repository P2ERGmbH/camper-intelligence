
import React, { Children, createRef, useCallback, useEffect, useMemo, useState } from 'react';
import Icon, { IconSizes } from './Icon';

interface SliderProps {
  defaultActiveSlide?: number;
  onSlideChange?: (slide: number) => void;
  children: React.ReactNode;
  loop?: boolean;
  pagination?: boolean;
  controls?: boolean;
}

export const Slide: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="relative flex w-full h-full items-center justify-center flex-shrink-0 snap-start flex-col">{children}</div>;
};

const Slider: React.FC<SliderProps> = ({
  defaultActiveSlide = 0,
  onSlideChange,
  children,
  loop = false,
  pagination = false,
  controls = true,
}) => {
  const [activeSlide, setActiveSlide] = useState(defaultActiveSlide);
  const innerChildren = Children.toArray(children);

  const slides = useMemo(() => {
    return innerChildren.map(() => createRef<HTMLDivElement>());
  }, [innerChildren]);

  const changeToSlide = useCallback(
    (index: number, scrollBehavior: ScrollBehavior = 'smooth') => {
      const currentIndex = loop
        ? (index + innerChildren.length) % innerChildren.length
        : Math.min(Math.max(index, 0), innerChildren.length - 1);
      const currentElement = slides[currentIndex]?.current;
      if (currentElement) {
        currentElement.scrollIntoView({
          inline: 'start',
          block: 'nearest',
          behavior: scrollBehavior,
        });
      }
    },
    [slides, loop, innerChildren.length],
  );

  useEffect(() => {
    if (activeSlide !== defaultActiveSlide) {
      changeToSlide(defaultActiveSlide, 'auto');
    }
  }, [defaultActiveSlide, activeSlide, changeToSlide]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollElement = e.currentTarget;
    const newActiveSlide = Math.round(scrollElement.scrollLeft / scrollElement.offsetWidth);
    if (newActiveSlide !== activeSlide) {
      setActiveSlide(newActiveSlide);
      if (onSlideChange) {
        onSlideChange(newActiveSlide);
      }
    }
  };

  return (
    <div className="relative overflow-hidden w-full rounded-lg h-full">
      <div className="flex overflow-auto snap-x snap-mandatory scroll-smooth" onScroll={handleScroll}>
        {Children.map(innerChildren, (child, index) => {
          if (!child) return null;
          return (
            <div ref={slides[index]} className="w-full flex-shrink-0 snap-center">
              {child}
            </div>
          );
        })}
      </div>
      {controls && (
        <>
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-3 z-10 rounded-full shadow-md h-10 w-10 cursor-pointer select-none bg-white flex items-center justify-center transition-opacity ${loop || activeSlide > 0 ? 'opacity-90 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => changeToSlide(activeSlide - 1)}
          >
            <Icon name="slide-left" size={IconSizes.S} />
          </div>
          <div
            className={`absolute top-1/2 -translate-y-1/2 right-3 z-10 rounded-full shadow-md h-10 w-10 cursor-pointer select-none bg-white flex items-center justify-center transition-opacity ${loop || activeSlide < innerChildren.length - 1 ? 'opacity-90 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => changeToSlide(activeSlide + 1)}
          >
            <Icon name="slide-right" size={IconSizes.S} />
          </div>
        </>
      )}
      {pagination && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 mx-auto">
          {innerChildren.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 border border-current rounded-full transition-colors ${index === activeSlide ? 'bg-current' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
