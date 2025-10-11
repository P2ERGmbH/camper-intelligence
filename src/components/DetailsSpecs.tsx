
import React from 'react';
import DetailsSection from './DetailsSection';
import DetailsBadge from './DetailsBadge';
import DetailsSpecsFloorplan from './DetailsSpecsFloorplan';
import DetailsSpecsSegment from './DetailsSpecsSegment';
import DetailsSpecsList from './DetailsSpecsList';
import Notice from './Notice';

// Define types for props
// ... (Add all necessary types here)

interface List {
  label: string;
  icon: string;
  items: { label: string; value: string; }[];
}

interface Section {
  lists: List[];
  floorplan: string;
  width?: number;
  height?: number;
}

interface SpecsProps {
  description?: string;
  sections: { day?: Section; night?: Section; };
}

interface DetailsSpecsProps {
  specs?: SpecsProps;
}

const DetailsSpecs: React.FC<DetailsSpecsProps> = ({ specs }) => {
  if (!specs) return null;

  const { description, sections } = specs;
  const daySection = sections.day;
  const nightSection = sections.night;

  return (
    <DetailsSection>
      <DetailsBadge>Vehicle Data</DetailsBadge>
      {description && (
        <div className="flex flex-col gap-4 mb-8 whitespace-pre-line">
          <h3>Description</h3>
          <div className="text-gray-500">{description}</div>
        </div>
      )}
      <div className="mb-12">
        <Notice>
          <div className="font-medium">Advice text here.</div>
        </Notice>
      </div>
      {daySection && (
        <DetailsSpecsSegment type="day">
          <div className="flex flex-col gap-8 py-12 md:py-16 md:gap-16">
            {daySection.lists.map((list: List) => (
              <DetailsSpecsList key={list.label + list.icon} list={list} />
            ))}
          </div>
          <div>
            <DetailsSpecsFloorplan src={daySection.floorplan} width={daySection.width} height={daySection.height} />
          </div>
        </DetailsSpecsSegment>
      )}
      {nightSection && (
        <DetailsSpecsSegment type="night">
          <div className="flex flex-col gap-8 py-12 md:py-16 md:gap-16">
            {nightSection.lists.map((list: List) => (
              <DetailsSpecsList key={list.label + list.icon} list={list} />
            ))}
          </div>
          <div>
            <DetailsSpecsFloorplan src={nightSection.floorplan} width={nightSection.width} height={nightSection.height} />
          </div>
        </DetailsSpecsSegment>
      )}
    </DetailsSection>
  );
};

export default DetailsSpecs;
