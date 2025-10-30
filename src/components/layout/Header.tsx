'use client';

import Image from '@/components/Image';
import { Link } from '@/i18n/routing';

import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  return (
    <header className="relative bg-[#141520] flex  p-4 justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif]">
      {/* Wrapper for Logo and Icons on mobile, acts as first grid item on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-2">
        <Link href={{ pathname: '/' }} className="content-stretch flex gap-[6px] items-center justify-start leading-[1.1] relative shrink-0 text-[24px] text-white tracking-[-0.48px]">
          <p className="font-normal relative shrink-0" data-node-id="777:117">
            camper
          </p>
          <p className="font-extrabold italic relative shrink-0" data-node-id="777:118">
            intelligence
          </p>
        </Link>


          {/* Icons */}
        <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0 lg:order-3">
          <div className="relative shrink-0 size-[24px]" data-name="uil:phone-alt" data-node-id="777:125">
            <Image alt="Phone icon" className="block max-w-none size-full" src="/assets/svg/uil-phone-alt.svg" width={24} height={24} />
          </div>
          <div className="relative shrink-0 size-[24px]" data-name="uil:letter-chinese-a" data-node-id="777:127">
            <Image alt="Language icon" className="block max-w-none size-full" src="/assets/svg/uil-letter-chinese-a.svg" width={24} height={24} />
          </div>
          <div className="relative shrink-0 size-[24px]" data-name="uil:user" data-node-id="777:129">
            <Image alt="User icon" className="block max-w-none size-full" src="/assets/svg/uil-user.svg" width={24} height={24} />
          </div>
          <div className="relative shrink-0 size-[24px]" data-name="uil:bars" data-node-id="777:131">
            <Image alt="Menu icon" className="block max-w-none size-full" src="/assets/svg/uil-bars.svg" width={24} height={24} />
          </div>
        </div>

          {/* Search Bar - always full width on mobile, centered and second in grid on desktop */}
          <SearchBar className="col-span-2 lg:col-span-1 lg:order-2" />
      </div>
    </header>
  );
}