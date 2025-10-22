import React from "react";
import Image from "next/image";

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    icon?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export default function Button({
                                   children,
                                   className,
                                   icon,
                                   disabled,
                                   onClick
                               }: ButtonProps) {
    return (
        <button
            disabled={!!disabled}
            className={`bg-[#f0f3f7] border border-[#e9e9e9] border-solid box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-0 py-[16px] relative rounded-[12px] shrink-0 w-full cursor-pointer${className ? '  ' + className : ''}${disabled ? ' opacity-50 pointer-events-none' : ''}`}
            onClick={onClick}>
            <div className="content-stretch flex gap-[3px] items-start relative shrink-0"
                 data-node-id="171:1028">
                {icon ? (
                    <div className="relative shrink-0 size-[16px]" data-name="uil:pen" data-node-id="171:1029">
                        <Image alt="Edit" className="block max-w-none size-full" src={icon}
                               width={16}
                               height={16}/>
                    </div>
                ) : null}
                <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#212229] text-[14px]">{children}</p>
            </div>
        </button>
    );
}