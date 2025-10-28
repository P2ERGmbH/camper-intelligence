'use client';

import Image from '@/components/Image';
import { Link } from '@/i18n/routing';
import { useSearch } from '@/contexts/SearchContext';
import { useState, useEffect } from 'react';
import SearchResultsOverlay from '@/components/SearchResultsOverlay';

export default function Header() {
  const { searchQuery, setSearchQuery, searchRef, searchScope, scopeLabel, clearSearchScope } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query);
    setSearchQuery(query);
  };

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
          <div className="col-span-2 lg:col-span-1 lg:order-2 flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px relative shrink-0 w-full md z-20">
            {searchQuery && <SearchResultsOverlay />}
            <div className="bg-[#24273c] border border-[#5b52ff] border-solid relative rounded-[100px] shrink-0 w-full" data-node-id="777:120">
              <div className="box-border content-stretch flex gap-[8px] items-center overflow-clip px-[24px] py-[12px] relative rounded-[inherit] w-full">
                <div className="relative shrink-0 size-[20px]" data-name="uil:search" data-node-id="777:121">
                  <Image alt="Search icon" className="block max-w-none size-full" src="/assets/svg/uil-search.svg" width={20} height={20} />
                </div>
                <input
                  type="text"
                  placeholder="Intelligente Suche"
                  className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#a4b0cf] text-[16px] bg-transparent border-none focus:outline-none w-full"
                  value={inputValue}
                  onChange={handleInputChange}
                  ref={searchRef}
                />
                  <div className={"absolute right-3 flex gap-2"}>
                    {searchScope !== 'global' && scopeLabel && (
                      <div className="bg-[#3a3a4f] box-border content-stretch flex gap-[4px] items-center pl-[8px] pr-[4px] py-[4px]  rounded-[8px] shrink-0 cursor-pointer" onClick={clearSearchScope}>
                        <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-white">
                          {scopeLabel}
                        </p>
                        <div className="relative shrink-0 size-[16px]">
                          <Image alt="Clear scope" className="block max-w-none size-full" src="/assets/svg/uil-times.svg" width={16} height={16} />
                        </div>
                      </div>
                    )}
                      {searchQuery && (
                          <div className="bg-[#3a3a4f] box-border content-stretch flex gap-[4px] items-center pl-[8px] pr-[4px] py-[4px]  rounded-[8px] shrink-0 cursor-pointer" onClick={()=>{setSearchQuery('')}}>
                              <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-white">
                                  Löschen
                              </p>
                              <div className="relative shrink-0 size-[16px]">
                                  <Image alt="Clear Search" className="block max-w-none size-full" src="/assets/svg/uil-times.svg" width={16} height={16} />
                              </div>
                          </div>
                      )}
                  </div>
              </div>
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_2px_24px_0px_rgba(0,0,0,0.32)]" />
            </div>
          </div>
      </div>
    </header>
  );
}