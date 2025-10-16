
import Image from 'next/image';
import {Camper} from "@/types/camper";

const renderPropertyIcon = (value: boolean | number | null | undefined) => {
  const isTrue = typeof value === 'number' ? value > 0 : value;
  return (
    <div className="relative shrink-0 size-[32px]">
      {isTrue ? (
        <div className="absolute bottom-[31.25%] left-1/4 right-1/4 top-[31.25%]" data-name="Shape" data-node-id="I171:393;0:50366">
          <div className="absolute inset-[5.4%_4.12%_0.32%_4.04%]" style={{ "--fill-0": "rgba(68, 209, 178, 1)" } as React.CSSProperties}>
            <Image alt="Check Haken" className="block max-w-none size-full" src="/assets/svg/check-haken.svg" width={32} height={32} />
          </div>
        </div>
      ) : (
        <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Icon/interface/cancel" data-node-id="171:399">
          <div className="absolute inset-[29.244%]" data-name="Vector" data-node-id="I171:399;46:7502">
            <Image alt="Cancel Icon" className="block max-w-none size-full" src="/assets/svg/icon-cancel-2.svg" width={32} height={32} />
          </div>
        </div>
      )}
    </div>
  );
};

const renderPropertyText = (value: boolean | number | null | undefined, text: string, unit: string = '') => {
  const isTrue = typeof value === 'number' ? value > 0 : value;
  const textColorClass = isTrue ? 'text-[#232d34]' : 'text-[#999999] line-through';
  const textDecorationClass = isTrue ? '' : '[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid';

  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      {renderPropertyIcon(value)}
      <div className={`flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] whitespace-nowrap ${textColorClass}`}>
        <p className={`leading-[1.3] ${textDecorationClass}`}>
          {text}{typeof value === 'number' && value > 1 ? `: ${value}${unit}` : ''}
        </p>
      </div>
    </div>
  );
};

export function CamperProperties({camper}: {camper:Camper}) {
  return (
      <div
          className="bg-white border border-[#d6dfe5] border-solid box-border content-stretch flex flex-col gap-[44px] items-start px-[40px] py-[32px] relative rounded-[16px] shrink-0 w-full"
          data-name="properties" data-node-id="171:306">
        <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[#212229] text-[32px] tracking-[-0.2px]"
           data-node-id="171:308">
          Eigenschaften
        </p>
        <div
            className="content-stretch grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-[120px] items-start relative shrink-0 w-full" data-node-id="171:362">
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Col" data-node-id="171:364">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Item" data-node-id="171:365">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#232d34] text-[20px] tracking-[-0.1px] whitespace-nowrap" data-node-id="171:367">
                <p className="leading-[1.2]">Maße (m)</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:368">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:369">
                <p className="leading-[1.3]">Länge</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:370">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-568.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:372">
                <p className="leading-[1.3]">{ Math.round((camper.dimension_length_max || camper.dimension_length_min ||  0) * 10) / 10}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:373">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:374">
                <p className="leading-[1.3]">Breite</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:375">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-569.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:377">
                <p className="leading-[1.3]">{ Math.round((camper.dimension_width_max || camper.dimension_width_min || 0) * 10) / 10}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:378">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:379">
                <p className="leading-[1.3]">Höhe</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:380">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-570.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:382">
                <p className="leading-[1.3]">{Math.round((camper.dimension_height_max || camper.dimension_height_min ||  0) * 10) / 10}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:383">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:384">
                <p className="leading-[1.3]">Innenhöhe</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:385">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-571.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:387">
                <p className="leading-[1.3]">{Math.round((camper.dimension_height_min || 0) * 10) / 10}</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Col" data-node-id="171:442">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Item" data-node-id="171:443">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#232d34] text-[20px] tracking-[-0.1px] whitespace-nowrap" data-node-id="171:445">
                <p className="leading-[1.2]">Betten (cm)</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:446">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:447">
                <p className="leading-[1.3]">Alkoven</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:448">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-572.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:450">
                <p className="leading-[1.3]">{camper.size_bed_alcoven_length} x {camper.size_bed_alcoven_width}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:451">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:452">
                <p className="leading-[1.3]">Essecke</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:453">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-573.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:455">
                <p className="leading-[1.3]">{camper.size_bed_dinette_length} x {camper.size_bed_dinette_width}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:456">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:457">
                <p className="leading-[1.3]">Hinten</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:458">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-574.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:460">
                <p className="leading-[1.3]">{camper.size_bed_rear_length} x {camper.size_bed_rear_width}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full" data-name="Row" data-node-id="171:461">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:462">
                <p className="leading-[1.3]">Sofa</p>
              </div>
              <div className="flex-[1_0_0] h-[8px] min-h-px min-w-px relative shrink-0" data-node-id="171:463">
                <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
                  <Image alt="" className="block max-w-none size-full" src="/assets/svg/frame-575.svg" width={100} height={8} />
                </div>
              </div>
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#232d34] text-[18px] whitespace-nowrap" data-node-id="171:465">
                <p className="leading-[1.3]">{camper.size_bed_sofa_length} x {camper.size_bed_sofa_width}</p>
              </div>
            </div>
          </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[64px] items-start min-h-px min-w-px relative shrink-0" data-name="Col" data-node-id="171:363">
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Col" data-node-id="171:388">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Item" data-node-id="171:389">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#232d34] text-[20px] tracking-[-0.1px] whitespace-nowrap" data-node-id="171:391">
                <p className="leading-[1.2]">Sanitär</p>
              </div>
            </div>
            {renderPropertyText(camper.shower_wc, 'WC & Dusche getrennt')}
            {renderPropertyText(camper.washbasin, 'Waschbecken')}
            {renderPropertyText(camper.shower_outdoor, 'Außendusche')}
            {renderPropertyText(camper.running_water, 'Fließend Warm- und Kaltwasser')}
            {renderPropertyText(camper.tank_freshwater, 'Frischwassertank', 'l')}
            {renderPropertyText(camper.tank_wastewater1, 'Abwassertank 1', 'l')}
            {renderPropertyText(camper.tank_wastewater2, 'Abwassertank 2', 'l')}
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Col" data-node-id="171:415">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Item" data-node-id="171:416">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#232d34] text-[20px] tracking-[-0.1px] whitespace-nowrap" data-node-id="171:418">
                <p className="leading-[1.2]">Küche</p>
              </div>
            </div>
            {renderPropertyText(camper.sink, 'Spüle')}
            {renderPropertyText(camper.fridge, 'Kühlschrank')}
            {renderPropertyText(camper.freezer, 'Gefrierschrank')}
            {renderPropertyText(camper.gas_stove, 'Gasherd')}
            {renderPropertyText(camper.microwave, 'Mikrowelle')}
            {renderPropertyText(camper.oven, 'Backofen')}
            {renderPropertyText(camper.microwave_oven, 'Mikrowellenofen')}
          </div>
        </div>
        <div className="box-border content-stretch flex flex-[1_0_0] flex-col gap-[64px] items-start min-h-px min-w-px pb-[64px] pt-[24px] px-0 relative shrink-0" data-name="Col" data-node-id="171:440">

          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Col" data-node-id="171:466">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Item" data-node-id="171:467">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#232d34] text-[20px] tracking-[-0.1px] whitespace-nowrap" data-node-id="171:469">
                <p className="leading-[1.2]">Wohnen</p>
              </div>
            </div>
            {renderPropertyText(camper.radiator, 'Heizung')}
            {renderPropertyText(camper.air_condition_living_area, 'Klimaanlage Wohnen')}
            {renderPropertyText(camper.slideout, 'Slideout')}
            {renderPropertyText(camper.passage_drivers_cabin, 'Durchgang zur Fahrerkabine')}
            {renderPropertyText(camper.awning, 'Markise')}
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Col" data-node-id="171:485">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Item" data-node-id="171:486">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#232d34] text-[20px] tracking-[-0.1px] whitespace-nowrap" data-node-id="171:488">
                <p className="leading-[1.2]">Media</p>
              </div>
            </div>
            {renderPropertyText(camper.tv, 'Fernseher')}
            {renderPropertyText(camper.dvd, 'DVD Player')}
            {renderPropertyText(camper.radio, 'Radio')}
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Col" data-node-id="171:498">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Item" data-node-id="171:499">
              <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#232d34] text-[20px] tracking-[-0.1px] whitespace-nowrap" data-node-id="171:501">
                <p className="leading-[1.2]">Fahren</p>
              </div>
            </div>
            {renderPropertyText(camper.air_condition_driving_cabin, 'Klimaanlage Fahrer')}
            {renderPropertyText(camper.passengers_seats, 'Sitzplätze mit Gurt')}
            {renderPropertyText(camper.passengers_seats_child_seats, 'Kindersitzbefestigungen')}
            {renderPropertyText(camper.cruise_control, 'Tempomat')}
            {renderPropertyText(camper.navigation, 'Navigation')}
            {renderPropertyText(camper.rear_cam, 'Rückfahrerkamera')}
            {renderPropertyText(camper.transmission_automatic, 'Automatik')}
            {renderPropertyText(camper.four_wd, 'Allrad')}
            {renderPropertyText(camper.consumption, 'Verbrauch', 'l')}
            {renderPropertyText(camper.tank_fuel_max, 'Kraftstofftank', 'l')}
          </div>
        </div>
      </div>
    </div>
  );
}
