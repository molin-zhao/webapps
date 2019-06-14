import * as ActionTypes from "./ActionTypes";
import { SecureStore, Localization } from "expo";
import * as LocalKeys from "../../common/localKeys";
import i18n from "i18n-js";
import { locale } from "../../common/locale";

i18n.fallbacks = true;
i18n.translations = locale;
export const finishAppInitialize = () => dispatch => {
  console.log("finish app initialize");
  dispatch(appInitialized(true));
};

export const getAppLocale = () => dispatch => {
  return SecureStore.getItemAsync(LocalKeys.APP_LOCALE)
    .then(lang => {
      if (!lang) {
        i18n.locale = Localization.locale;
      } else {
        i18n.locale = lang;
      }
      dispatch(appLocale(i18n));
    })
    .catch(err => {
      console.log(err);
      i18n.locale = Localization.locale;
      dispatch(appLocale(i18n));
    });
};

export const setAppLocate = localeString => dispatch => {
  i18n.locale = localeString;
  dispatch(appLocale(i18n));
};

export const appInitialized = bool => ({
  type: ActionTypes.APP_FINISH_INIT,
  payload: bool
});

export const appLocale = locale => ({
  type: ActionTypes.SET_APP_LOCALE,
  payload: locale
});
