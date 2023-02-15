import i18n from "i18next";
import language from "./locales/lang.json";
import {
  initReactI18next
} from 'react-i18next';
import LocalStorage_subata from "./page/util/localStroage";
let { getItem } = new LocalStorage_subata({
  filter: ['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath']
})
i18n
.use(initReactI18next)
.init({
  resources: {
    en: {
      translation: language.en,
    },
    zh: {
      translation: language.zh,
    },
    zh_tw:{
      translation: language.zh_tw
    }
  },
  //默认语言
  fallbackLng: getItem('lang') || 'zh',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
})


export default i18n;