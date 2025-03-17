import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { StorageService } from '../services/storage';
import en from './translations/en';
import pt from './translations/pt';

// Initialize i18next
const initI18n = async () => {
  // Try to get saved language from storage
  let savedLanguage = await StorageService.getLanguage();

  // Default to Portuguese if no language is saved
  if (!savedLanguage) {
    savedLanguage = 'pt';
    await StorageService.saveLanguage(savedLanguage);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        pt: { translation: pt },
      },
      lng: savedLanguage,
      fallbackLng: 'pt',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export { initI18n };
export default i18n;