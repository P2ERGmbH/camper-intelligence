
import React from 'react';

import Image from 'next/image';

interface CancellationBoxContentProps {
  isFree?: boolean;
  boxHeadline?: string;
  boxCopy?: React.ReactNode[];
}

export const CancellationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-row">{children}</div>
);

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col">{children}</div>
);

export const TextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="leading-8">{children}</div>
);

export const InfoHeadline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-lg font-bold mb-2">{children}</div>
);

const CancellationBoxContent: React.FC<CancellationBoxContentProps> = ({
  isFree,
  boxHeadline,
  boxCopy,
}) => {
  return (
    <CancellationWrapper>
      <ContentWrapper>
        <div className={`py-1 px-2 rounded w-fit mb-4 ${isFree ? 'bg-green-700' : 'bg-blue-500'} text-white`}>
          Cancellation
        </div>
        <TextWrapper>
          <InfoHeadline>{boxHeadline}</InfoHeadline>
          {boxCopy}
        </TextWrapper>
      </ContentWrapper>
      <div className="flex-shrink-0 w-1/4 self-start">
        <Image src="/path/to/camper-coin.png" alt="Camper Coin" width={100} height={100} />
      </div>
    </CancellationWrapper>
  );
};

export default CancellationBoxContent;
