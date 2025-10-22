'use client';

import React, {useState, useEffect, useTransition} from 'react';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import InputField from '@/components/inputs/InputField';
import {CategorizedImage} from '@/types/image';
import Toggle from "@/components/inputs/Toggle";
import ImageEditTile from "@/components/images/ImageEditTile";
import {useRouter} from "next/navigation";

interface ImageEditProps {
    images: CategorizedImage[];
    categories: {label:string, value:string}[];
    onImageSave: (image: Partial<CategorizedImage>) => Promise<{image:CategorizedImage}>;
    onImageUpdate: (updatedImage: CategorizedImage) => void;
    onImageDelete: (imageId: number) => Promise<boolean>;
}

export default function ImageEdit({
                                      images,
                                      categories=[],
                                      onImageSave,
                                      onImageUpdate,
                                      onImageDelete}: ImageEditProps) {
    const t = useTranslations('import');
    const [activeImage, setActiveImage] = useState<CategorizedImage | null>(null);
    const [isSaving, startSavingTransition] = useTransition();
    const [isDeleting, startDeletingTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        if (images && images.length > 0) {
            if (activeImage) {
                const updatedActiveImage = images.find(img => img.id === activeImage.id);
                if (updatedActiveImage) {
                    setActiveImage(updatedActiveImage);
                } else {
                    setActiveImage(images[0]);
                }
            } else {
                setActiveImage(images[0]);
            }
        }
    }, [images, activeImage]);

    const handleSave = async (name:string, value:string|number|boolean) => {
        const editData: Partial<CategorizedImage> = { ...activeImage, [name]: value }
        startSavingTransition(async () => {
            const {image} = await onImageSave(editData);
            if (image?.id) {
                onImageUpdate(image);
                router.refresh(); // Refresh the page to show updated images
            }
        });
    };

    const handleDelete = async (imageId: number) => {
        if (!confirm(t('confirm_delete_image'))) {
            return;
        }

        startDeletingTransition(async () => {
            const response = await onImageDelete(imageId);
            if (response) {
                router.refresh(); // Refresh the page to show updated images
            }
        });
    };

    return (
        <div className={"w-full"}>
            <div
                className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-full">
                <div className="relative shrink-0 size-[32px]">
                    <Image alt="Camera icon" className="block max-w-none size-full" src="/assets/svg/uil-camera.svg"
                           width={32} height={32}/>
                </div>
                <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[24px] text-black tracking-[-0.1px]">
                    {t('images_section_title')}
                </p>
            </div>
            <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
                <div
                    className="content-stretch grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-[12px] items-start relative shrink-0 w-full">
                    {images.map((image) => (
                        <ImageEditTile
                            key={image.id}
                            image={image}
                            isActive={image.id === activeImage?.id}
                            onEdit={() => {
                                setActiveImage(image);
                            }}
                            onDelete={() => {
                                handleDelete(image.id);
                            }}
                            onRedo={() => {
                            }}
                            onSelect={() => {
                                setActiveImage(image);
                            }}/>
                    ))}
                    <div
                        className="border border-[#626680] border-dashed aspect-6/4 w-full h-full box-border content-stretch flex justify-center items-center relative rounded-[12px] shrink-0 w-full">
                        <div
                            className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0">
                            <div className="relative shrink-0 size-[48px]">
                                <Image alt="Cloud upload icon" className="block max-w-none size-full"
                                       src="/assets/svg/uil-cloud-upload.svg" width={48} height={48}/>
                            </div>
                            <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0">
                                <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[18px] text-black">
                                    Drag and drop
                                </p>
                                <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#8c8f95] text-[14px]">
                                    {t('or')}
                                </p>
                                <div
                                    className="bg-black box-border content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-full">
                                    <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-white">
                                        {t('upload_image')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="hidden" value={activeImage?.id || ''} name="image_id"/>
                        <InputField
                            label={t('category')}
                            id="image_category"
                            name="category"
                                    disabled={isSaving || isDeleting}
                                    value={activeImage?.category || ''} type={"select"}
                                    selectOptions={categories}
                                    onChange={(e) => activeImage?.id && handleSave('category', e.target.value)}/>
                        <InputField label={t('author')} id="image_copyright_holder_name" name="copyright_holder_name"
                                    disabled={isSaving || isDeleting}
                                    value={activeImage?.copyright_holder_name || ''}
                                    onChange={(e) => activeImage?.id && handleSave('copyright_holder_name', e.target.value)}/>
                        <InputField label={t('copyright')} id="image_copyright_holder_link" name="copyright_holder_link"
                                    disabled={isSaving || isDeleting}
                                    value={activeImage?.copyright_holder_link || ''}
                                    onChange={(e) => activeImage?.id && handleSave('copyright_holder_link', e.target.value)}/>
                        <InputField label={t('alt_text')} id="image_alt_text" name="alt_text"
                                    disabled={isSaving || isDeleting}
                                    value={activeImage?.alt_text || ''}
                                    onChange={(e) => activeImage?.id && handleSave('alt_text', e.target.value)}/>
                        <InputField label={t('description')} id="image_caption" name="caption"
                                    disabled={isSaving || isDeleting}
                                    value={activeImage?.caption || ''}
                                    onChange={(e) => activeImage?.id && handleSave('caption', e.target.value)}
                                    type="textarea" rows={4}/>
                    </div>
                </div>
                <div
                    className="content-stretch flex flex-col gap-[40px] items-start justify-center relative shrink-0 w-full">
                    <Toggle label={"Aktiv"} checked={activeImage?.active || false} name={'active'} id={'image_active'}
                            onChange={(e) => activeImage?.id && handleSave('active', e.target.checked)}/>
                </div>
            </div>
        </div>
    );
}
