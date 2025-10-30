'use client';

import React, {createContext, useContext, useState, useCallback, ReactNode} from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SubheaderContextType {
  searchScope?: 'local'|'global';
  setSearchScope?: (value: 'local'|'global') => void;
  onDiscard?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onHistory?: () => void;
  setCanEdit: (value: boolean) => void;
  canEdit?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  registerCallback: (type: 'discard' | 'save' | 'delete' | 'history', callback: () => void) => void;
  unregisterCallback: (type: 'discard' | 'save' | 'delete' | 'history') => void;
}
const SubheaderContext = createContext<SubheaderContextType | undefined>(undefined);

export function SubheaderProvider({children, canEdit}: { children: ReactNode, canEdit?: boolean }) {
    const [callbacks, setCallbacks] = useState<Partial<Record<'discard' | 'save' | 'delete' | 'history', () => void>>>({});
    const [canEditState, setCanEditState] = useState(canEdit)
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [searchScope, setSearchScope] = useState<'local'|'global'>('global');

    const registerCallback = useCallback((type: 'discard' | 'save' | 'delete' | 'history', callback: () => void) => {
        setCallbacks((prev) => ({...prev, [type]: callback}));
    }, []);

    const unregisterCallback = useCallback((type: 'discard' | 'save' | 'delete' | 'history') => {
        setCallbacks((prev) => {
            const newCallbacks = {...prev};
            delete newCallbacks[type];
            return newCallbacks;
        });
    }, []);

    const value = {
        searchScope,
        setSearchScope,
        onDiscard: callbacks.discard,
        onSave: callbacks.save,
        onDelete: callbacks.delete,
        onHistory: callbacks.history,
        canEdit: canEditState,
        breadcrumbs,
        setBreadcrumbs,
        registerCallback,
        unregisterCallback,
        setCanEdit: setCanEditState
    };

    return <SubheaderContext.Provider value={value}>{children}</SubheaderContext.Provider>;
}

export function useSubheader() {
    const context = useContext(SubheaderContext);
    if (context === undefined) {
        throw new Error('useSubheader must be used within a SubheaderProvider');
    }
    return context;
}
