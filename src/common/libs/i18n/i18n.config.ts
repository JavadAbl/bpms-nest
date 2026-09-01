import { AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

export const getI18nConfig = () => {
  return {
    fallbackLanguage: 'en', // Default language if none is detected
    loaderOptions: {
      path: join(__dirname, '/i18n/'), // Where your translation files live
      watch: false, // Hot-reload translations in dev without restarting the app
    },
    resolvers: [
      // 1. Check ?lang=xx in URL
      { use: QueryResolver, options: ['lang'] },
      // 2. Check Accept-Language header
      { use: AcceptLanguageResolver },
    ],
  };
};
