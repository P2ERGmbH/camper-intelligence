
import React, { useState } from 'react';
import DetailsBadge from './DetailsBadge';
import StarRating, { StarRatingSize } from './StarRating';
import InfoButton from './InfoButton';
import TruncatedTextLink from './TruncatedTextLink';
import DetailsRentalCompanyConditions from './DetailsRentalCompanyConditions';
import Sidebar from './Sidebar';

interface RentalCompany {
  info?: {
    id?: string;
    description?: string;
    name?: string;
    rating?: number;
    rentalConditions?: string;
    logo?: string;
  };
}

interface DetailsRentalCompanyProps {
  rentalCompany?: RentalCompany;
}

const DetailsRentalCompany: React.FC<DetailsRentalCompanyProps> = ({ rentalCompany }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { description, name, rating, rentalConditions, logo, id } = rentalCompany?.info || {};
  const cleanDescription = description && description !== "<p><br />\r\n</p>" ? description : "";

  return (
    <>
      <DetailsBadge>Rental Company</DetailsBadge>
      <h3 className="font-bold text-xl">{name}</h3>
      <div className="relative flex items-center">
        <StarRating label={rating?.toString()} value={rating} size={StarRatingSize.L} />
        <InfoButton onClick={() => setSidebarOpen(true)} />
      </div>
      {cleanDescription && (
        <TruncatedTextLink
          text={cleanDescription}
          characters={300}
          linkText={`Read more about ${name}`}
          link={`/rental-company/?id=${id}`}
        />
      )}
      <DetailsRentalCompanyConditions
        rentalConditions={rentalConditions}
        name={name}
        logo={logo}
      />
      <Sidebar
        onCloseRequest={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
        headline={name}
      >
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="font-bold text-xl">Rating</h3>
          <div>This is how the rating is composed.</div>
          <StarRating label={rating?.toString()} value={rating} size={StarRatingSize.L} />
        </div>
      </Sidebar>
    </>
  );
};

export default DetailsRentalCompany;
