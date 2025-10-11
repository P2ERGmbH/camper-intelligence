
import React, { forwardRef } from 'react';

interface DetailsSectionProps {
  children: React.ReactNode;
}

const DetailsSection = forwardRef<HTMLDivElement, DetailsSectionProps>(({ children }, ref) => {
  return (
    <div ref={ref} className="relative my-12 md:my-16">
      {children}
    </div>
  );
});

DetailsSection.displayName = 'DetailsSection';

export default DetailsSection;
