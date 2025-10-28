'use client';

import React, {useEffect, useState, useCallback} from 'react';
import {useSearch} from '@/contexts/SearchContext';
import {Link} from '@/i18n/routing';
import Image from 'next/image';
import {generateProviderSlug} from "@/lib/utils/slug";
import {performSearch, SearchResults} from "@/lib/search";
import {useTranslations} from 'next-intl';

// TODO: Download these images locally to public/assets/img and public/assets/svg and update paths.
const imgUilHouseUser = "/assets/svg/uil-house-user.svg";
const imgUilDocumentInfo = "/assets/svg/uil-document-info.svg";
const imgUilCar = "/assets/svg/uil-car.svg";

interface LocalSearchResult {
    id: string;
    text: string;
    element: HTMLElement;
}

export default function SearchResultsOverlay() {
    const {
        searchQuery,
        setSearchQuery,
        scrollToTopAndFocusSearch,
        searchScope,
        setSearchScope,
        localSearchTargetRef
    } = useSearch();
    const t = useTranslations('search');
    const [globalResults, setGlobalResults] = useState<SearchResults | null>(null);
    const [localResults, setLocalResults] = useState<LocalSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDbResults, setShowDbResults] = useState(false);

    const performLocalSearch = useCallback(() => {
        if (!localSearchTargetRef?.current || !searchQuery) {
            setLocalResults([]);
            return;
        }

        const results: LocalSearchResult[] = [];
        const elements = localSearchTargetRef.current.querySelectorAll('label, input, textarea, p, h1, h2, h3, h4, h5, h6');
        let resultId = 0;

        elements.forEach(element => {
            const textContent = element.textContent || (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.value : '');
            if (textContent.toLowerCase().includes(searchQuery.toLowerCase())) {
                results.push({
                    id: `local-result-${resultId++}`,
                    text: textContent,
                    element: element as HTMLElement,
                });
            }
        });
        setLocalResults(results);
    }, [searchQuery, localSearchTargetRef]);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchScope === 'local') {
                performLocalSearch();
                setLoading(false);
            } else {
                if (searchScope === null || searchScope === 'global') {
                    performLocalSearch();
                }
                if (!searchQuery || searchQuery.length < 3) {
                    setGlobalResults(null);
                    setLocalResults([]);
                    return;
                }

                setLoading(true);
                setError(null);
                try {
                    const data: SearchResults = await performSearch(searchQuery);
                    setGlobalResults(data);
                } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : 'An unknown error occurred');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchResults();
    }, [searchQuery, searchScope, performLocalSearch]);

    const handleJumpToElement = useCallback((element: HTMLElement) => {
        element.scrollIntoView({behavior: 'smooth', block: 'center'});
        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = 'yellow';
        setTimeout(() => {
            element.style.backgroundColor = '';
        }, 1000);
        setSearchQuery('');
    }, [setSearchQuery]);

    const handleSearchDatabase = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setSearchScope('global', null);
            const data: SearchResults = await performSearch(searchQuery);
            setGlobalResults(data);
            setShowDbResults(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, setSearchScope]);

    if (!searchQuery) {
        return null;
    }

    return (
        <div
            className="absolute top-0 left-0 w-full bg-[#13142a] box-border content-stretch flex flex-col gap-[16px] items-start overflow-clip pb-[16px] pt-[52px] px-[16px] rounded-bl-[32px] rounded-br-[32px] shadow-[0px_127px_36px_0px_rgba(0,0,0,0.01),0px_81px_33px_0px_rgba(0,0,0,0.04),0px_46px_27px_0px_rgba(0,0,0,0.15),0px_20px_20px_0px_rgba(0,0,0,0.26),0px_5px_11px_0px_rgba(0,0,0,0.29)] shrink-0">
            {loading && <p className="text-white">{t('searching')}</p>}
            {error && <p className="text-red-500">{t('error')}: {error}</p>}

            {!loading && !error && (
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    {searchScope === 'local' && localResults.length > 0 && !showDbResults && (
                        <>
                            <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-white mb-2">{t('local_results')}</p>
                            {localResults.map((result) => (
                                <button key={result.id} onClick={() => handleJumpToElement(result.element)}
                                        className="box-border content-stretch flex items-center justify-between p-[8px] relative shrink-0 w-full text-left text-white hover:bg-[#2d304c] rounded-md">
                                    <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[16px]">{result.text}</p>
                                </button>
                            ))}
                            <button onClick={handleSearchDatabase}
                                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                {t('show_all_results')}
                            </button>
                        </>
                    )}

                    {(searchScope === 'global' || showDbResults) && (
                        <>
                            {globalResults && (globalResults.campers.length > 0 || globalResults.providers.length > 0 || globalResults.stations.length > 0) ? (
                                <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-white mb-2">{t('database_results')}</p>
                            ) : (
                                <p className="text-[#a4b0cf]">{t('no_results_found')}</p>
                            )}

                            {globalResults?.providers.map((provider) => (
                                <Link href={{
                                    pathname: '/provider/[slug]',
                                    params: {slug: generateProviderSlug(provider.company_name, provider.id)}
                                }} key={provider.id}
                                      className="box-border content-stretch flex items-center justify-between p-[8px] relative shrink-0 w-full"
                                      onClick={() => {
                                          setSearchQuery('');
                                          scrollToTopAndFocusSearch();
                                      }}>
                                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                                        <div className="relative shrink-0 size-[28px]">
                                            <Image alt="" className="block max-w-none size-full" src={imgUilHouseUser}
                                                   width={28} height={28}/>
                                        </div>
                                        <div
                                            className="box-border content-stretch flex flex-col items-start justify-center leading-[1.3] pb-[2px] pt-0 px-0 relative shrink-0">
                                            <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold relative shrink-0 text-[16px] text-white">
                                                {provider.company_name}
                                            </p>
                                            <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal relative shrink-0 text-[#a4b0cf] text-[14px]">
                                                {t('provider')}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="bg-white content-stretch flex flex-col gap-[4px] items-center justify-center relative rounded-[8px] shrink-0 size-[50px]">
                                        {provider.imageTile?.url && (
                                            <Image alt={provider.company_name}
                                                   className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full rounded-[8px]"
                                                   src={provider.imageTile?.url} width={50} height={50}/>
                                        )}
                                    </div>
                                </Link>
                            ))}

                            {globalResults?.stations.map((station) => (
                                <Link href={{
                                    pathname: '/provider/[slug]/stations/[stationId]',
                                    params: {
                                        slug: generateProviderSlug('Vermieter', station.provider_id),
                                        stationId: station.id
                                    }
                                }} key={station.id}
                                      className="box-border content-stretch flex items-center justify-between p-[8px] relative shrink-0 w-full"
                                      onClick={() => {
                                          setSearchQuery('');
                                          scrollToTopAndFocusSearch();
                                      }}>
                                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                                        <div className="relative shrink-0 size-[28px]">
                                            <Image alt="" className="block max-w-none size-full"
                                                   src={imgUilDocumentInfo} width={28} height={28}/>
                                        </div>
                                        <div
                                            className="box-border content-stretch flex flex-col items-start justify-center leading-[1.3] pb-[2px] pt-0 px-0 relative shrink-0">
                                            <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold relative shrink-0 text-[16px] text-white">
                                                {station.name}
                                            </p>
                                            <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal relative shrink-0 text-[#a4b0cf] text-[14px]">
                                                {t('station')} · {station.city}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="bg-white content-stretch flex flex-col gap-[4px] items-center justify-center relative rounded-[8px] shrink-0 size-[50px]">
                                        {station.imageTile?.url && (
                                            <Image alt={station.name || "Station"}
                                                   className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full rounded-[8px]"
                                                   src={station.imageTile.url} width={50} height={50}/>
                                        )}
                                    </div>
                                </Link>
                            ))}

                            {globalResults?.campers.map((camper) => (
                                <Link href={{
                                    pathname: '/provider/[slug]/campers/[camperId]',
                                    params: {
                                        slug: generateProviderSlug('Camper', camper.provider_id),
                                        camperId: camper.id
                                    }
                                }} key={camper.id}
                                      className="bg-[#2d304c] border border-[#55577a] border-solid box-border content-stretch flex items-center justify-between p-[8px] relative rounded-[12px] shrink-0 w-full"
                                      onClick={() => {
                                          setSearchQuery('');
                                          scrollToTopAndFocusSearch();
                                      }}>
                                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                                        <div className="relative shrink-0 size-[28px]">
                                            <Image alt="" className="block max-w-none size-full" src={imgUilCar}
                                                   width={28} height={28}/>
                                        </div>
                                        <div
                                            className="box-border content-stretch flex flex-col items-start justify-center leading-[1.3] pb-[2px] pt-0 px-0 relative shrink-0">
                                            <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold relative shrink-0 text-[16px] text-white">
                                                {camper.name}
                                            </p>
                                            <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal relative shrink-0 text-[#a4b0cf] text-[14px]">
                                                {t('camper')} · {globalResults.providers.find(p => p.id === camper.provider_id)?.company_name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative rounded-[8px] shrink-0 size-[50px]">
                                        {camper.imageUrl && (
                                            <Image alt={camper.name}
                                                   className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[8px] size-full"
                                                   src={camper.imageUrl} width={50} height={50}/>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}

                    {searchScope === 'local' && localResults.length === 0 && !showDbResults && (
                        <p className="text-[#a4b0cf]">{t('no_results_found')}</p>
                    )}

                    {(searchScope === 'global' || showDbResults) && globalResults && globalResults.campers.length === 0 && globalResults.providers.length === 0 && globalResults.stations.length === 0 && (
                        <p className="text-[#a4b0cf]">{t('no_results_found')}</p>
                    )}
                </div>
            )}
        </div>
    );
}