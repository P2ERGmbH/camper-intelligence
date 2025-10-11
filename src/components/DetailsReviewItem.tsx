
import React, { useState } from 'react';
import Icon, { IconSizes } from './Icon';
import TruncateText from './TruncateText';
import DetailsReviewResponse from './DetailsReviewResponse';
import { LinkButton } from './Link';

interface Summary {
  icon: string;
  color: string;
  label: string;
}

interface DetailsReviewItemProps {
  user: string;
  from: string;
  to: string;
  station: string;
  userStatement: string;
  userOriginal?: string;
  summary: Summary[];
  replyStatement?: string;
  replyOriginal?: string;
  statementDate?: string;
}

const colorMap: { [key: string]: string } = {
  'has-secondary-medium-dark-color': 'text-gray-500',
  'has-signal-red-color': 'text-red-700',
  'has-turquoise-color': 'text-green-700',
};

const DetailsReviewItem: React.FC<DetailsReviewItemProps> = ({
  user,
  from,
  to,
  station,
  userStatement,
  userOriginal,
  summary,
  replyStatement,
  replyOriginal,
  statementDate,
}) => {
  const [originOpen, setOriginOpen] = useState(false);

  const getReviewerInfo = () => {
    return `${user} - from ${from} to ${to} - ${station}`;
  };

  const displayedReview = originOpen ? userOriginal : userStatement;

  return (
    <div className="border-t border-gray-100 mt-6 pt-6 first:border-t-0 first:mt-0 first:pt-0">
      <div className="text-gray-500 text-sm">{getReviewerInfo()}</div>
      <div className="flex gap-2 overflow-auto my-4 -mx-4 px-4 md:mx-0 md:px-0">
        {summary.map(({ icon, color, label }) => (
          <div
            key={label}
            className={`relative flex items-center gap-2 py-1 px-4 whitespace-nowrap ${colorMap[color] || 'text-green-700'}`}>
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-current opacity-10"></div>
            <Icon size={IconSizes.M} name={icon} />
            <div className="text-sm font-bold text-gray-800">{label}</div>
          </div>
        ))}
      </div>
      {userStatement && (
        <div>
          <TruncateText
            lines={3}
            showMore={<LinkButton isUnderlined={false} isBold>+ Read more</LinkButton>}
          >
            {displayedReview}
          </TruncateText>
        </div>
      )}
      {replyStatement && (
        <div>
          <DetailsReviewResponse
            statement={replyStatement}
            statementDate={statementDate}
            origin={replyOriginal}
          />
        </div>
      )}
      {userOriginal && (
        <div className="mt-4">
          <div className="flex flex-row gap-1 text-sm">
            Message was automatically translated
            <div
              onClick={() => setOriginOpen((prevState) => !prevState)}
              className="text-current border-green-700 cursor-pointer border-0 no-underline transition-all duration-200 ease-in-out"
            >
              <div className="inline hover:text-green-800">
                <b className="font-bold">
                  {originOpen ? "Hide original" : "Show original"}
                </b>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsReviewItem;
