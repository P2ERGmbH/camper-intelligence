
import { createDbConnection } from '@/lib/db/utils';
import { getStationsByProviderId } from '@/lib/db/stations';
import { Station } from '@/types/station';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import {Metadata} from "next";
import StationTile from '@/components/stations/StationTile';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Stations`;
  const description = `Stations for provider ${slug}`;
  return { title, description };
}

export default async function StationsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  let stations: Station[] = [];

  let connection;

  try {
    const slugParts = slug.split('-');
    const providerId = parseInt(slugParts[slugParts.length - 1]);

    if (!isNaN(providerId)) {
      connection = await createDbConnection();
      stations = await getStationsByProviderId(connection, providerId);
    }
  } catch (err) {
    console.error('Failed to fetch provider stations on server:', err);
  } finally {
    if (connection) connection.end();
  }

  return (
    <div className="bg-[#e8ecf3] dark:bg-gray-900 relative size-full" data-name="/[locale]/provider/[slug]/stations" data-node-id="98:301">
      {/* <Header className="absolute bg-[#212229] box-border content-stretch flex gap-[40px] h-[84px] items-center left-[24px] px-[56px] py-[24px] rounded-[16px] top-[32px] w-[1488px]" /> */}
      <div className="flex flex-col gap-[48px] items-start mx-auto pb-0 pt-28 px-6 w-full max-w-[1536px]" data-name="Content" data-node-id="146:1400">
        <div className="content-stretch flex gap-[4px] items-end justify-end relative shrink-0" data-name="Header Section" data-node-id="146:1401">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start justify-center min-h-px min-w-px relative shrink-0" data-node-id="146:1402">
            <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] min-w-full relative shrink-0 text-[32px] text-black tracking-[-0.2px] w-[min-content] whitespace-pre-wrap" data-node-id="146:1403">
              Alle Stationen
            </p>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Buttons" data-node-id="146:1404">
              <Link href={{ pathname: '/provider/[slug]/stations/add', params: { slug } }} className="bg-black box-border content-stretch flex gap-[6px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0" data-name="Button" data-node-id="146:1405">
                <Image alt="" className="relative shrink-0 size-[20px]" src="/assets/svg/uil-plus-circle.svg" width={20} height={20} />
                <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-white" data-node-id="146:1408">
                  Station hinzufügen
                </p>
              </Link>
              <Link href={{ pathname: '/provider/[slug]/stations/import', params: { slug } }} className="bg-black box-border content-stretch flex gap-[6px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0" data-name="Button" data-node-id="146:1409">
                <Image alt="" className="relative shrink-0 size-[20px]" src="/assets/svg/uil-file-import.svg" width={20} height={20} />
                <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-white" data-node-id="146:1412">
                  Aus CSV importieren
                </p>
              </Link>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start justify-center relative rounded-[12px] shrink-0" data-name="Dropdown Filter" data-node-id="146:1413">
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#646464] text-[14px]" data-node-id="146:1414">
              Sortieren
            </p>
            <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-node-id="146:1415">
              <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-black" data-node-id="146:1416">
                Alphabetisch
              </p>
              <Image alt="" className="relative shrink-0 size-[24px]" src="/assets/svg/uil-angle-down.svg" width={24} height={24} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] relative shrink-0" data-name="Station Tiles" data-node-id="146:1419">
          {stations.map((station: Station) => (
            <StationTile key={station.id} station={station} slug={slug} />
          ))}
          <Link href={{ pathname: '/provider/[slug]/stations/add', params: { slug } }} className="border-2 border-[#acacac] border-dashed h-full minrelative rounded-[16px] shrink-0 w-full" data-name="Add Station Tile" data-node-id="146:1540">
            <div className="content-stretch flex flex-col gap-[16px] h-full min-h-60 items-center justify-center overflow-clip relative rounded-[inherit] w-full">
              <Image alt="" className="relative shrink-0 size-[56px]" src="/assets/svg/uil-plus-circle-1.svg" width={56} height={56} />
              <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[16px] text-black" data-node-id="146:1543">
                Station hinzufügen
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}