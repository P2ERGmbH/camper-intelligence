import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

const imgUilHouseUser = "/assets/svg/uil-house-user.svg";
const imgUilDocumentInfo = "/assets/svg/uil-document-info.svg";
const imgUilCar = "/assets/svg/uil-car.svg";
const imgUilUser = "/assets/svg/uil-user.svg"; // Placeholder for user icon
const imgUilMapMarker = "/assets/svg/uil-map-marker.svg"; // Placeholder for city icon
const imgLucideScroll = "/assets/svg/lucide-scroll.svg";

interface Href {
    pathname: string;
    params: Record<string, string | number>;
}

interface SearchResultItemProps {
    type: 'user' | 'station' | 'provider' | 'camper' | 'city';
    name: string;
    description: string;
    imageUrl?: string | null;
    imageAlt: string;
    href: Href;
    onClick?: () => void;

}

const getIconSrc = (type: SearchResultItemProps['type']) => {
    switch (type) {
        case 'provider':
            return imgLucideScroll;
        case 'station':
            return imgUilHouseUser;
        case 'camper':
            return imgUilCar;
        case 'user':
            return imgUilUser;
        case 'city':
            return imgUilMapMarker;
        default:
            return imgUilDocumentInfo; // Default icon
    }
};

export default function SearchResultItem({ type, name, description, imageUrl, imageAlt, href, onClick }: SearchResultItemProps) {
    const iconSrc = getIconSrc(type);

    return (
        <Link href={href}
              prefetch
              className="border border-solid border-transparent box-border content-stretch flex items-center justify-between p-[8px] relative shrink-0 w-full rounded-[12px] hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-[#2d304c] dark:hover:border-[#55577a]"
              onClick={onClick}>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[28px]">
                    <Image alt="" className="block max-w-none size-full filter light:brightness-0 dark:filter dark:brightness(0) dark:saturate(100%) dark:invert(77%) dark:sepia(10%) dark:saturate(2900%) dark:hue-rotate(190deg) dark:brightness(102%) dark:contrast(96%)" src={iconSrc} width={28} height={28} />
                </div>
                <div className="box-border content-stretch flex flex-col items-start justify-center leading-[1.3] pb-[2px] pt-0 px-0 relative shrink-0">
                    <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold relative shrink-0 text-[16px] text-gray-900 dark:text-white">
                        {name}
                    </p>
                    <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal relative shrink-0 text-[14px] text-gray-600 dark:text-[#a4b0cf]">
                        {description}
                    </p>
                </div>
            </div>
            {imageUrl && (
                <div className={`relative rounded-[8px] shrink-0 w-20 aspect-video overflow-hidden ${type === 'provider' ? 'bg-white' : ''}`}>
                    <Image alt={imageAlt}
                           className={`absolute inset-0 ${type === 'provider' ? 'object-contain' : 'object-cover'} pointer-events-none size-full`}
                           src={imageUrl}
                           width={20*8}
                           height={20*8 * 9/16}
                    />
                </div>
            )}
        </Link>
    );
}
