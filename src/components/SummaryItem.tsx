
import React, { useState } from 'react';
import Icon from './Icon';
import DetailsInfoButton from './DetailsInfoButton';
import BottomSheet from './BottomSheet';

interface SummaryItemProps {
  iconName: string;
  iconSize: string | number;
  label: string;
  content: string;
  subline?: string;
  infoContent?: string;
  infoHeadline?: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  iconName,
  iconSize,
  label,
  content,
  subline,
  infoContent,
  infoHeadline,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row gap-2 items-center md:flex-1 md:flex-basis-1/2">
      <Icon name={iconName} size={iconSize} />
      <div>
        <div className="flex gap-1 items-center">
          {label}
          {infoContent && (
            <DetailsInfoButton
              onClick={() => {
                setOpen(true);
              }}
            />
          )}
        </div>
        <div className="font-bold">{content}</div>
        {subline && <div className="text-gray-500">{subline}</div>}
      </div>
      {infoContent && (
        <BottomSheet
          onCloseRequest={() => {
            setOpen(false);
          }}
          isOpen={open}
          title={infoHeadline}
        >
          <div className="whitespace-pre-wrap">{infoContent}</div>
        </BottomSheet>
      )}
    </div>
  );
};

export default SummaryItem;
