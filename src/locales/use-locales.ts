'use client';

import dayjs from 'dayjs';
import { useCallback } from 'react';

import { viLang } from './all-langs';

// ----------------------------------------------------------------------

export function useTranslate(ns?: string) {
  const currentLang = viLang;

  const onChangeLang = useCallback(async (newLang: any) => {
    try {
      dayjs.locale(currentLang.adapterLocale);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    onChangeLang,
    currentLang,
  };
}
