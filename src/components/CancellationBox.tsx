
import React from 'react';
import CancellationBoxContent from './CancellationBoxContent';

interface CancellationBoxProps {
  isFree?: boolean;
  boxHeadline?: string;
  boxCopy?: React.ReactNode[];
}

const CancellationBox: React.FC<CancellationBoxProps> = ({ isFree, boxHeadline, boxCopy }) => {
  return (
    <div className="p-6 bg-green-100 rounded-lg mb-8">
      <CancellationBoxContent isFree={isFree} boxHeadline={boxHeadline} boxCopy={boxCopy} />
    </div>
  );
};

export default CancellationBox;
