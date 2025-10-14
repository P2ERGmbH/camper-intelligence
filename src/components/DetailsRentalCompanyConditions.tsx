
import React from 'react';
import Image from './Image';
import { Link } from './Link';

interface DetailsRentalCompanyConditionsProps {
  name?: string;
  logo?: string;
  rentalConditions?: string;
}

const DetailsRentalCompanyConditions: React.FC<DetailsRentalCompanyConditionsProps> = ({ name, logo, rentalConditions }) => {
  return (
    <div className="bg-gray-100 border-gray-200 text-gray-700 p-8 rounded-lg flex gap-8 mt-8">
      <div className="hidden md:flex flex-1 basis-1/3 p-4 bg-white">
        {logo && <Image src={logo} alt={name} className="object-contain" />}
      </div>
      <div className="flex flex-col justify-center gap-4">
        <div>
          Here you can download the rental conditions of {name}.
        </div>
        <Link href={rentalConditions || ''} target="_blank" className="bg-gray-300 text-black p-2 rounded-md text-center">
          Download Rental Conditions
        </Link>
      </div>
    </div>
  );
};

export default DetailsRentalCompanyConditions;
