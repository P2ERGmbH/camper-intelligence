import React, { useState, useRef, useEffect } from 'react';

interface TruncateTextProps {
  showMore?: React.ReactNode;
  children: React.ReactNode;
  lines?: number;
}

const TruncateText: React.FC<TruncateTextProps> = ({ showMore = "Show more", children, lines = 2 }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;

    if (current) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const isOverflowing = entry.target.scrollHeight > entry.target.clientHeight;
        setIsTruncated(isOverflowing);
      });

      observer.observe(current);

      return () => {
        observer.unobserve(current);
      };
    }
  }, [ref]);

  return (
    <div className="relative">
      <div
        ref={ref}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'none' : lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      {isTruncated && !isExpanded && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setIsExpanded(true);
            }
          }}
          onClick={() => setIsExpanded(true)}
          className="absolute bottom-0 right-0 pl-10 bg-gradient-to-r from-transparent to-white"
        >
          {showMore}
        </div>
      )}
    </div>
  );
};

export default TruncateText;