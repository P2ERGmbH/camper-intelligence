
import React from 'react';
import DetailsSection from './DetailsSection';
import InfoBadge from './InfoBadge';

interface InfoItem {
  headline: string;
  text: string;
}

interface SpecialItem {
  id: string;
  name: string;
}

interface DetailsInformationProps {
  infos?: InfoItem[];
  specials?: SpecialItem[];
}

const DetailsInformation: React.FC<DetailsInformationProps> = ({ infos, specials }) => {
  const cleanedInfos = infos?.filter((n) => n);

  if (!cleanedInfos?.length && !specials?.length) {
    return null;
  }

  return (
    <DetailsSection>
      {cleanedInfos && cleanedInfos.length > 0 && (
        <div className="p-6 bg-yellow-100 rounded-lg mb-8">
          <InfoBadge background="var(--yellow-700)" withSpacing>
            Info
          </InfoBadge>
          {cleanedInfos.map((info, index) => (
            <div key={index}>
              <div className="text-lg font-bold mb-2">{info.headline}</div>
              <div>{info.text}</div>
            </div>
          ))}
        </div>
      )}
      {specials && specials.length > 0 && (
        <div className="pl-6">
          <InfoBadge background="var(--blue-500)" withSpacing>
            Specials
          </InfoBadge>
          <div className="text-lg font-bold mb-2">Special Offers</div>
          <ul className="mt-2 list-disc list-inside">
            {specials.map((special) => (
              <li key={special.id}>{special.name}</li>
            ))}
          </ul>
        </div>
      )}
    </DetailsSection>
  );
};

export default DetailsInformation;
