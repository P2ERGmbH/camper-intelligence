'use client';

import { Link } from '@/i18n/routing';
import Image from 'next/image';
import {Camper} from "@/types/camper";
import {ImageUpload} from "@/types/image";

interface CamperTileProps {
  camper: Camper;
  images: ImageUpload[];
  ctaLink: {
    pathname: '/provider/dashboard/campers/[id]';
    params?: { [key: string]: string | number };
  };
  ctaLabel: string;
}

export default function CamperTile({ camper, images, ctaLink, ctaLabel }: CamperTileProps) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-56 bg-gray-200">
        {images.length ? (
          <Image src={images[0].url} alt={images[0].alt_text || camper.name} fill className={"object-cover"} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m-6 0h.01M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"></path></svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{camper.name}</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3"></path></svg>
            <span>Sleeps: {camper.sleeps_adults || 0}{camper.sleeps_children ? ` + ${camper.sleeps_children}` : ''}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>Seats: {camper.passengers_seats || 0}</span>
          </div>
          <div className="flex items-center col-span-2">
             <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            <span>{camper.transmission_automatic ? 'Automatic' : 'Manual'}</span>
          </div>
        </div>
        <Link href={{pathname: ctaLink.pathname, params:ctaLink.params}} className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
