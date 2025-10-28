// Force re-evaluation in dev
'use client';

import React, {createContext, useState, useContext, ReactNode, useCallback, useRef} from 'react';
import {debounce} from 'lodash';
import {useTranslations} from "next-intl";

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchRef: React.RefObject<HTMLInputElement> | null;
    scrollToTopAndFocusSearch: () => void;
    searchScope: 'global' | 'local' | null;
    scopeLabel: string | null;
    setSearchScope: (scope: 'global' | 'local' | null) => void;
    clearSearchScope: () => void;
    localSearchTargetRef: React.RefObject<HTMLElement> | null;
    setLocalSearchTargetRef: (ref: React.RefObject<HTMLElement> | null) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({children}: { children: ReactNode }) => {
    const tSearch = useTranslations('search');
    const [searchQuery, setSearchQueryState] = useState<string>('');
    const [searchScope, setSearchScopeState] = useState<'global' | 'local' | null>('global');
    const [scopeLabel, setScopeLabel] = useState<string | null>(null);
    const searchRef = useRef<React.RefObject<HTMLInputElement> | null>(null);
    const [localSearchTargetRef, setLocalSearchTargetRefState] = useState<React.RefObject<HTMLElement> | null>(null);

    const scrollToTopAndFocusSearch = useCallback(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (searchRef?.current?.focus) {
            searchRef.current?.focus();
        }
    }, []);

    const setSearchScope = useCallback((scope: 'global' | 'local' | null) => {
        setSearchScopeState(scope);
        if (scope === 'local') {
            setScopeLabel(tSearch('local_scope_label'));
        } else {
            setScopeLabel(null);
        }
    }, [tSearch]);

    const clearSearchScope = useCallback(() => {
        setSearchScopeState('global');
        setScopeLabel(null);
    }, []);

    const setLocalSearchTargetRef = useCallback((ref: React.RefObject<HTMLElement>|null) => {
        setLocalSearchTargetRefState(ref);
    }, []);

    // Debounce the actual state update
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearchQuery = useCallback(
        debounce((query: string) => {
            setSearchQueryState(query);
        }, 300),
        [setSearchQueryState]
    );

    const setSearchQuery = (query: string) => {
        debouncedSetSearchQuery(query);
    };

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchRef,
            scrollToTopAndFocusSearch,
            searchScope,
            scopeLabel,
            setSearchScope,
            clearSearchScope,
            localSearchTargetRef,
            setLocalSearchTargetRef
        }}>
            {children}
        </SearchContext.Provider>
    );
};


export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
