'use client';

import Image from '@/components/Image';
import { useSearch } from '@/contexts/SearchContext';
import { useState, useEffect } from 'react';
import SearchResultsOverlay from '@/components/search/SearchResultsOverlay';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const { searchQuery, setSearchQuery, searchRef, searchScope, scopeLabel, clearSearchScope } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query);
    setSearchQuery(query);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const searchBarClasses = `
    bg-[#24273c] border border-[#5b52ff] border-solid relative rounded-[100px] shrink-0 w-full
    ${isFocused ? 'bg-gradient-to-r from-[rgba(91,82,255,0.3)] via-[rgba(201,127,180,0.3)] to-[rgba(97,104,170,0.3)] shadow-[0_0_15px_5px_rgba(91,82,255,0.5)]' : ''}
  `;

  const inputClasses = `
    font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[16px] bg-transparent border-none focus:outline-none w-full
    ${isFocused ? 'text-white' : 'text-[#a4b0cf]'}
  `;

  return (
    <div className={`flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px relative shrink-0 w-full md z-20 ${className}`}>
      {searchQuery && <SearchResultsOverlay />}
      <div className={searchBarClasses} data-node-id="777:120">
        <div className="box-border content-stretch flex gap-[8px] items-center overflow-clip px-[24px] py-[12px] relative rounded-[inherit] w-full">
          <div className="relative shrink-0 size-[20px]" data-name="uil:search" data-node-id="777:121">
            <Image alt="Search icon" className="block max-w-none size-full" src="/assets/svg/uil-search.svg" width={20} height={20} />
          </div>
          <input
            type="text"
            placeholder="Intelligente Suche"
            className={inputClasses}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={searchRef}
          />
          <div className="absolute right-3 flex gap-2">
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
              <div className="bg-[#3a3a4f] box-border content-stretch flex gap-[4px] items-center pl-[8px] pr-[4px] py-[4px]  rounded-[8px] shrink-0 cursor-pointer" onClick={() => { setSearchQuery('') }}>
                <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-white">
                  Löschen
                </p>
                <div className="relative shrink-0 size-[16px]">
                  <Image alt="Clear Search" className="block max-w-none size-full" src="/assets/svg/uil-times.svg" width={16} height={16} />
                </div>
              </div>
            )}
          </div>
          <div className={`absolute inset-0 pointer-events-none ${isFocused ? 'shadow-[inset_0px_2px_24px_0px_rgba(0,0,0,0.32)]' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
