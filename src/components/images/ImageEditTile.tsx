'use client';

import Image from 'next/image';
import {CategorizedImage} from '@/types/image';

interface StationImageEditTileProps {
    image: CategorizedImage;
    isActive: boolean;
    onSelect: (image: CategorizedImage) => void;
    onEdit: (imageId: number) => void;
    onDelete: (imageId: number) => void;
    onRedo: (imageId: number) => void;
}

function iconButton(alt: string, src: string, onClick: () => void) {
    return (<div className="relative shrink-0 size-[34px]"
                 onClick={onClick}>
        <Image alt={alt} className="block max-w-none size-full" src={src} width={34}
               height={34}/>
    </div>)
}

export default function ImageEditTile({
                                          image,
                                          isActive,
                                          onSelect,
                                          onEdit,
                                          onDelete,
                                          onRedo
                                      }: StationImageEditTileProps) {
    //className={`box-border content-stretch flex gap-[8px] aspect-square items-start justify-end p-[12px] relative rounded-[12px] size-full cursor-pointer ${isActive ? 'border-2 border-indigo-500' : ''}`}
    return (
        <div
            key={image.id}
            className={`rounded-[12px] border relative aspect-6/4 overflow-hidden ${isActive ? 'border-indigo-500' : 'border-[#626680]'}`}
            style={isActive ? {clipPath: "shape(      from 0% 0%,      hline to 100%,      vline to 100%, hline to 70%,      curve to 30% 100% with 50% 85%, hline to 0%,      close    )"} : {}}
            onClick={() => onSelect(image)}
        >
            <Image alt={image.alt_text || 'Image'}
                   fill
                   className={'object-cover'}
                   src={image.url}/>
            <div className="relative shrink-0 size-[34px]"
                 onClick={() => onEdit(image.id)}>
                <Image alt="Edit icon" className="block max-w-none size-full" src="/assets/svg/uil-pen.svg" width={34}
                       height={34}/>
            </div>
            <div
                className={`bg-white box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[11px] relative rounded-[40px] shrink-0 size-[34px] ${image.origin !== 'upload' ? 'opacity-50 cursor-not-allowed' : ''}`}
                data-name="uil:trash-alt" data-node-id="611:178"
                onClick={(e) => {
                    if (image.origin !== 'upload') {
                        e.stopPropagation();
                        return;
                    }
                    onRedo(image.id);
                }}>
                {iconButton("Redo icon", "/assets/svg/uil-redo.svg", () => onRedo(image.id))}
            </div>
            {iconButton("Trash icon", "/assets/svg/uil-trash-alt.svg", () => onDelete(image.id))}
            {isActive && (
                <div className="absolute h-[30.21px] left-[50%] translate-x-[-50%] bottom-0 w-[122px]"
                     data-name="SelectdBulge" data-node-id="611:185">
                    <div className="absolute bottom-0 left-0 right-0 top-[29.16%]">
                        <Image alt="Selected Bulge" className="block max-w-none size-full"
                               src="/assets/svg/selected-bulge.svg" width={122} height={30}/>
                    </div>
                </div>
            )}
        </div>
    );
}