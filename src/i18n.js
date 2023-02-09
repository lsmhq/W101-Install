import i18n from "i18next";
import enUsTrans from "./locales/en.json";
import zhCnTrans from "./locales/zh.json";
import zhTwTrans from './locales/zh_tw.json'
import {
  initReactI18next
} from 'react-i18next';
import LocalStorage_subata from "./page/util/localStroage";
let { getItem, setItem } = new LocalStorage_subata({
  filter: ['wizInstall', 'installPath', 'steamInstall', 'wizPath', 'gameDataPath']
})
if(getItem('lang') === null){
  setItem('lang', 'zh')
}
i18n
.use(initReactI18next)
.init({
  resources: {
    en: {
      translation: enUsTrans,
    },
    zh: {
      translation: zhCnTrans,
    },
    zh_tw:{
      translation:zhTwTrans
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