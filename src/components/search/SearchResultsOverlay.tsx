'use client';

import React, {useEffect, useState, useCallback} from 'react';
import {useSearch} from '@/contexts/SearchContext';

import {performSearch, SearchResults} from "@/lib/search";
import {useTranslations} from 'next-intl';
import SearchResultsList from '@/components/search/SearchResultsList';

// TODO: Download these images locally to public/assets/img and public/assets/svg and update paths.


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
        element.style.backgroundColor = '#5b52ff';
        setTimeout(() => {
            element.style.backgroundColor = '';
        }, 1000);
        setSearchQuery('');
    }, [setSearchQuery]);

    const handleSearchDatabase = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setSearchScope('global');
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
                            <SearchResultsList
                                providers={globalResults?.providers}
                                campers={globalResults?.campers}
                                stations={globalResults?.stations}
                                onResultClick={() => {
                                    setSearchQuery('');
                                    scrollToTopAndFocusSearch();
                                }}
                            />
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