import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Can be imported from a shared config
export const locales = ['en', 'bn'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Try to get locale from cookie first, then fall back to parameter or default
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  const validLocale = (cookieLocale && locales.includes(cookieLocale as Locale)) 
    ? cookieLocale 
    : (locale && locales.includes(locale as Locale) ? locale : 'en');

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
