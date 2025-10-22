import React from 'react';
import Image from 'next/image';
import {Image as ImageType} from '@/types/image';
import Slider from "@/components/images/Slider";
import Toggle from "@/components/inputs/Toggle";
import {getFlagByCountryCode} from "@/lib/utils/country";


interface StationTileProps {
    headline: string | React.ReactNode;
    copy: string | React.ReactNode;
    countryCode: string;
    active: boolean;
    children: React.ReactNode;
    images: ImageType[];
}

export default function ProviderTile({headline, copy, children, countryCode, images, active}: StationTileProps) {
    return (
        <div className="flex flex-col border border-neutral-200 border-solid overflow-hidden relative rounded-[16px]">
            <div className="w-full relative">
                <Slider className={"aspect-[16/9]"}>{images.map((image: ImageType, index) =>
                    (<Image key={image.id} alt={image.alt_text || "Image " + index}
                            className="aspect-[16/9] object-cover"
                            width={640} height={360}
                            src={image.url || "/assets/img/station-image-2.png"}/>
                    ))}</Slider>
                <div className={"right-2 top-2 absolute"}>
                    <Toggle label={""} name={"active"} checked={active} onChange={() => {
                    }}/>
                </div>
            </div>
            <div
                className="bg-white grow flex flex-col gap-[36px] items-start pb-[24px] pt-[20px] px-[24px] relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                        <div
                            className="content-stretch flex font-bold gap-[4px] items-center justify-center leading-[1.2] relative shrink-0 text-[#212229] text-[24px] tracking-[-0.1px] w-full">
                            <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0 whitespace-pre-wrap">
                                {headline}
                            </p>
                            {countryCode ? (
                                <div className="relative shrink-0">
                                    {getFlagByCountryCode(countryCode)}
                                </div>
                            ) : null}
                        </div>
                        <div
                            className="font-normal leading-[1.5] relative shrink-0 text-[#4d616e] text-[14px] w-full whitespace-pre-wrap">
                            {copy}
                        </div>
                    </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
