"use client";

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Placeholder image paths - User needs to verify and ensure these assets are in public/assets/svg
const imgUilAngleDown = "/assets/svg/uil-angle-down.svg";
const imgUilAngleRight = "/assets/svg/uil-angle-right.svg";
const imgFrame128 = "/assets/svg/frame-128.svg"; // Assuming this is an SVG for search icon
const imgLine54 = "/assets/svg/line-54.svg"; // Assuming this is an SVG for the separator line
const imgUilTrashAlt = "/assets/svg/uil-trash-alt.svg";
const imgUilHistory = "/assets/svg/uil-history.svg";
const imgUilTimes = "/assets/svg/uil-times.svg";
const imgUilSave = "/assets/svg/uil-save.svg";

interface BreadcrumbItem {
  label: string;
  href?: { pathname: string; params?: Record<string, string> };
}

export default function ProviderSubHeader() {
  const pathname = usePathname();
  const t = useTranslations('ProviderSubHeader'); // Assuming a translation namespace for this component
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isEditPath, setIsEditPath] = useState(false);

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '' && segment !== 'provider' && segment !== 'en' && segment !== 'de' && segment !== 'fr');
    const newBreadcrumbs: BreadcrumbItem[] = [];

    newBreadcrumbs.push({ label: t('vermieter'), href: { pathname: '/provider/dashboard' } });

    let currentPath = '/provider';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      let label = segment;
      let href: { pathname: string; params?: Record<string, string> } | undefined = undefined;

      if (segment.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[4][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i)) { // Assuming slug is a UUID
        // This is a provider slug, we need to fetch the provider name
        // For now, using a placeholder. In a real app, this would involve fetching data.
        label = "RoadBear"; // Placeholder
        href = { pathname: '/provider/[slug]', params: { slug: segment } };
      } else if (segment === 'stations') {
        label = t('stations');
        href = { pathname: '/provider/[slug]/stations', params: { slug: pathSegments[index - 1] } }; // Assuming previous segment is slug
      } else if (segment === 'edit') {
        label = t('edit');
        setIsEditPath(true);
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize for display
        href = { pathname: currentPath };
      }

      newBreadcrumbs.push({ label, href });
    });

    setBreadcrumbs(newBreadcrumbs);
    setIsEditPath(pathname.includes('/edit'));
  }, [pathname, t]);

  const handleSearchClick = () => {
    // Logic to focus on the header search input
    console.log("Focus on header search");
    // This would typically involve a ref to the search input in a parent Header component
    // or a global state management solution to trigger the focus.
  };

  return (
    <div className="backdrop-blur-[6px] backdrop-filter bg-[#262734] border-[#3e3e4d] border-b-0 border-l-0 border-r-0 border-solid border-t box-border content-stretch flex flex-col md:flex-row items-start md:items-center justify-between px-[24px] py-[16px] relative w-full sticky top-0 z-10">
      {/* Breadcrumbs and Search Button */} 
      <div className="flex items-center w-full md:w-full gap-4">
        <div className="content-stretch flex gap-[6px] items-center relative overflow-x-auto flex-grow">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-[6px] whitespace-nowrap">
              {index > 0 && (
                <div className="relative shrink-0 size-[24px]">
                  <Image alt="Angle Right" className="block max-w-none size-full" src={imgUilAngleRight} width={24} height={24} />
                </div>
              )}
              {item.href ? (
                <Link href={item.href} className="bg-[#3a3a4f] box-border content-stretch flex gap-[4px] items-end pl-[8px] pr-[4px] py-[4px] relative rounded-[8px] shrink-0">
                  <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-white">
                    {item.label}
                  </p>
                  <div className="relative shrink-0 size-[16px]">
                    <Image alt="Angle Down" className="block max-w-none size-full" src={imgUilAngleDown} width={16} height={16} />
                  </div>
                </Link>
              ) : (
                <div className="box-border content-stretch flex gap-[4px] items-end px-0 py-[4px] relative rounded-[8px] shrink-0">
                  <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-white">
                    {item.label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleSearchClick} className="h-[20px] relative shrink-0 w-[24px] cursor-pointer">
          <Image alt="Search" className="block max-w-none size-full" src={imgFrame128} width={24} height={20} />
        </button>
      </div>

      {/* Edit Section */} 
      {isEditPath && (
        <div className="content-stretch flex gap-[9px] items-center relative shrink-0 mt-4 md:mt-0 md:ml-4 overflow-x-auto w-full">
          <div className="hidden md:flex h-[20px] items-center justify-center relative shrink-0 w-[1px] mr-4">
            <Image alt="Separator" className="block max-w-none h-full w-full" src={imgLine54} width={1} height={20} />
          </div>
          <button className="bg-[#333351] box-border content-stretch flex gap-[4px] items-center justify-center p-[8px] relative rounded-[88px] shrink-0 size-[38px] cursor-pointer">
            <Image alt="Trash" className="relative shrink-0 size-[22px]" src={imgUilTrashAlt} width={22} height={22} />
          </button>
          <button className="bg-[#333351] box-border content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[88px] shrink-0 cursor-pointer">
            <Image alt="History" className="relative shrink-0 size-[22px]" src={imgUilHistory} width={22} height={22} />
          </button>
          <div className="flex flex-row items-center self-stretch">
            <button className="bg-[#333351] box-border content-stretch flex gap-[8px] h-full items-center pl-[12px] pr-[16px] py-[8px] relative rounded-[88px] shrink-0 cursor-pointer">
              <Image alt="Discard" className="relative shrink-0 size-[22px]" src={imgUilTimes} width={22} height={22} />
              <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-white whitespace-nowrap">Verwerfen</p>
            </button>
          </div>
          <button className="bg-[#081d47] border border-[#020535] border-solid box-border content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[88px] shrink-0 cursor-pointer overflow-hidden">
            <Image alt="Save" className="relative shrink-0 size-[22px]" src={imgUilSave} width={22} height={22} />
            <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-white">Speichern</p>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_20px_0px_#0026ff]" />
          </button>
        </div>
      )}
    </div>
  );
}
