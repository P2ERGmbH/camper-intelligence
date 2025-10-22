"use client";
import React, {ReactNode, useRef, useState, useEffect} from 'react';

export type SliderProps = {
    children: ReactNode[] | ReactNode;
    className?: string;
    indicatorBottom?: string;
};

const arrowLeft = (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 16L8 10L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const arrowRight = (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 4L12 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Slider: React.FC<SliderProps> = ({children, className, indicatorBottom = 'bottom-2'}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const slides = React.Children.toArray(children);
    const [activeIndex, setActiveIndex] = useState(0);

    // Track current slide index
    const getCurrentIndex = () => {
        const el = scrollRef.current;
        if (!el) return 0;
        const slideWidth = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth : 0;
        if (!slideWidth) return 0;
        return Math.round(el.scrollLeft / slideWidth);
    };

    // Update activeIndex on scroll
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            setActiveIndex(getCurrentIndex());
        };
        el.addEventListener('scroll', handleScroll, {passive: true});
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to a specific slide
    const scrollToIndex = (idx: number) => {
        const el = scrollRef.current;
        if (!el) return;
        const slideWidth = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth : 0;
        el.scrollTo({left: idx * slideWidth, behavior: 'smooth'});
    };

    const scroll = (dir: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const slideWidth = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth : 0;
        const totalSlides = slides.length;
        const currentIndex = getCurrentIndex();
        let nextIndex = currentIndex;
        if (dir === 'left') {
            nextIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
        } else {
            nextIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
        }
        el.scrollTo({left: nextIndex * slideWidth, behavior: 'smooth'});
    };

    return (
        <div className={`relative group ${className ?? ''}`.trim()}>
            {/* Scrollable area */}
            <div
                ref={scrollRef}
                tabIndex={0}
                className="flex overflow-x-auto w-full scrollbar-hide snap-mandatory scroll-smooth snap-x"
            >
                {slides.map((child, idx) => (
                    <div key={idx} className="w-full  overflow-hidden shrink-0 snap-center relative">
                        {child}
                    </div>
                ))}
            </div>
            {slides.length > 1 ? (
                <>
                    {/* Left button */}
                    <button
                        type="button"
                        aria-label="Scroll left"
                        onClick={() => scroll('left')}
                        className="hidden group-hover:flex items-center justify-center absolute top-1/2 left-2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow transition hover:opacity-100 hover:scale-110 opacity-80 border border-gray-200"
                    >
                        {arrowLeft}
                    </button>
                    {/* Right button */}
                    <button
                        type="button"
                        aria-label="Scroll right"
                        onClick={() => scroll('right')}
                        className="hidden group-hover:flex items-center justify-center absolute top-1/2 right-2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow transition hover:opacity-100 hover:scale-110 opacity-80 border border-gray-200"
                    >
                        {arrowRight}
                    </button>
                    {/* Pagination dots styled as scroll-marker */}
                    <div className={`absolute ${indicatorBottom} left-1/2 -translate-x-1/2 flex gap-1.5 z-10`}>
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={
                                    `cursor-pointer transition-all duration-150 h-2 shadow-100 box-border rounded bg-white ${activeIndex !== idx ? 'w-2 opacity-60' : 'w-5'}`
                                }
                            />
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Slider; 