
import React, { useState } from 'react';
import TruncateText from './TruncateText';
import { Link } from './Link';
import Image from './Image';

interface DetailsReviewResponseProps {
  statement: string;
  statementDate?: string;
  origin?: string;
}

const DetailsReviewResponse: React.FC<DetailsReviewResponseProps> = ({ statement, statementDate, origin }) => {
  const [originOpen, setOriginOpen] = useState(false);
  const statementSelected = originOpen ? origin : statement;

  return (
    <div className="flex flex-col gap-4 p-4 pl-6 md:pl-8 ml-4 md:ml-8 border-l-2 border-gray-100">
      <div className="flex flex-row gap-3 items-center text-gray-500">
        <div className="w-11 h-11 flex-shrink-0">
          <Image src="/path/to/logo.svg" width={42} height={42} alt="CU | Camper" className="object-contain" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-bold">Our Response</div>
          {statementDate && <small>{statementDate}</small>}
        </div>
      </div>
      {statement && (
        <div>
          <TruncateText
            lines={3}
            showMore={<Link isUnderlined={false} isBold>+ Show more</Link>}
          >
            {statementSelected}
          </TruncateText>
        </div>
      )}
      {origin && (
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

export default DetailsReviewResponse;
