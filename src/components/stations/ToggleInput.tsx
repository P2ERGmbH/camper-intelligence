'use client';

import React from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import Toggle from "@/components/inputs/Toggle";

interface ToggleInputProps {
    label: string;
    checkboxId: string;
    checkboxName: string;
    checkboxChecked: boolean;
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputId?: string;
    inputName?: string;
    inputValue?: string;
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputPlaceholder?: string;
}

export default function ToggleInput({
                                        label,
                                        checkboxId,
                                        checkboxName,
                                        checkboxChecked,
                                        onCheckboxChange,
                                        inputId,
                                        inputName,
                                        inputValue,
                                        onInputChange,
                                        inputPlaceholder,
                                    }: ToggleInputProps) {
    const t = useTranslations('import');

    return (
        <div
            className="flex flex-col md:flex-row gap-4 md:gap-[68px] h-auto md:h-[56px] items-start md:items-center relative shrink-0 w-full">
            <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[18px] text-black w-full md:w-[216px] whitespace-pre-wrap">
                {label}
            </p>
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full md:w-auto">
                <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-auto">
                    <Toggle
                        name={checkboxName}
                        id={checkboxId}
                        checked={checkboxChecked}
                        onChange={onCheckboxChange}
                        label={t('yes')}
                        className="mt-1 h-6 w-6 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                {checkboxChecked && inputId && inputName && onInputChange && (
                    <div
                        className="border border-[#626680] border-solid box-border content-stretch flex items-center justify-between p-[16px] relative rounded-[12px] shrink-0 w-[194px]">
                        <input
                            type="text"
                            name={inputName}
                            id={inputId}
                            value={inputValue || ''}
                            onChange={onInputChange}
                            placeholder={inputPlaceholder}
                            className="block w-full text-sm text-black placeholder-gray-500 focus:outline-none"
                        />
                        <div className="relative shrink-0 size-[24px]">
                            <Image alt="Edit icon" className="block max-w-none size-full" src="/assets/svg/uil-pen.svg"
                                   width={24} height={24}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
