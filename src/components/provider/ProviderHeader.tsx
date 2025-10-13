'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function ProviderHeader() {
    const t = useTranslations('provider');

    return (
        <header className={'dark:bg-gray-900 relative pt-6 px-6'}>
            <div
                className="relative bg-[#212229] flex items-center justify-between px-6 py-4 md:px-14 md:py-6 rounded-2xl">
                {/* Logo */}
                <div className="flex items-center gap-1 text-white text-2xl">
                    <p className="font-normal">camper</p>
                    <p className="font-extrabold italic">intelligence</p>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex flex-1 justify-center gap-12 text-white text-base font-bold">
                    <a href="#" className="hover:text-gray-300">{t('header-solutions')}</a>
                    <Link href={{pathname: '/provider/dashboard'}}
                          className="hover:text-gray-300">{t('dashboard-link')}</Link>
                    <a href="#" className="hover:text-gray-300">{t('header-pricing')}</a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    {/* Kontakt Button */}
                    <button className="hidden md:block px-6 py-2 rounded-md text-black text-base font-bold"
                            style={{backgroundImage: "linear-gradient(163.7419779612836deg, rgba(86, 222, 239, 1) 11.291%, rgba(72, 152, 227, 1) 79.198%, rgba(254, 199, 169, 1) 154.12%), linear-gradient(90deg, rgba(174, 230, 246, 1) 0%, rgba(174, 230, 246, 1) 100%)"}}>
                        {t('header-contact')}
                    </button>

                    {/* Icons */}
                    <div className="flex items-center gap-6">
                        <Image src="/assets/svg/language.svg" alt="Language" width={24} height={24}/>
                        <Image src="/assets/svg/user.svg" alt="User" width={24} height={24}/>
                        <Image src="/assets/svg/menu.svg" alt="Menu" width={24} height={24}/>
                    </div>
                </div>
            </div>
        </header>
    );
}