'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bnTranslations from './bn.json';
import enTranslations from './en.json';

type Translations = typeof bnTranslations;

interface I18nContextType {
  locale: 'bn' | 'en';
  setLocale: (locale: 'bn' | 'en') => void;
  t: (key: string) => string;
}

const translations: Record<'bn' | 'en', Translations> = {
  bn: bnTranslations,
  en: enTranslations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<'bn' | 'en'>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('locale');
    if (saved === 'bn' || saved === 'en') {
      setLocale(saved);
    }
  }, []);

  const handleSetLocale = (newLocale: 'bn' | 'en') => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: unknown = translations[locale];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}