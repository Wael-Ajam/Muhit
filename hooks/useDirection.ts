"use client";

import { useLocale } from 'next-intl';

export function useDirection() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  return {
    isRTL,
    direction: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    textAlign: isRTL ? 'text-right' : 'text-left',
    flexDirection: isRTL ? 'flex-row' : 'flex-row-reverse',
    // For arrows and icons that should flip
    arrowRotation: isRTL ? 'rotate-180' : '',
    // For positioning
    startSide: isRTL ? 'right' : 'left',
    endSide: isRTL ? 'left' : 'right',
    // For margins/paddings
    marginStart: isRTL ? 'mr' : 'ml',
    marginEnd: isRTL ? 'ml' : 'mr',
    paddingStart: isRTL ? 'pr' : 'pl',
    paddingEnd: isRTL ? 'pl' : 'pr',
    // Border
    borderStart: isRTL ? 'border-r' : 'border-l',
    borderEnd: isRTL ? 'border-l' : 'border-r',
  };
}
