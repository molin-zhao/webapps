import * as ActionTypes from "./ActionTypes";
import { SecureStore, Localization, Permissions } from "expo";
import * as LocalKeys from "../../common/localKeys";
import { locale } from "../../common/locale";

export const finishAppInitialize = () => dispatch => {
  console.log("finish app initialize");
  dispatch(appInitialized(true));
};

export const getAppPermissions = () => async dispatch => {
  let camera_p = await Permissions.getAsync(Permissions.CAMERA);
  let library_p = await Permissions.getAsync(Permissions.CAMERA_ROLL);
  let location_p = await Permissions.getAsync(Permissions.LOCATION);
  let camera_v = camera_p.status === "granted" ? true : false;
  let library_v = library_p.status === "granted" ? true : false;
  let location_v = location_p.status === "granted" ? true : false;
  dispatch(updateAppPermissionsOnInit(camera_v, library_v, location_v));
};

export const getAppLocale = () => dispatch => {
  return SecureStore.getItemAsync(LocalKeys.APP_LOCALE)
    .then(lang => {
      if (lang) dispatch(appLocale(lang));
      else if (locale[Localization.locale])
        dispatch(appLocale(Localization.locale));
      else dispatch(appLocale("en-US"));
    })
    .catch(err => {
      console.log(err);
      dispatch(appLocale(Localization.locale));
    });
};

export const setAppLocale = localeString => dispatch => {
  return SecureStore.setItemAsync(LocalKeys.APP_LOCALE, localeString)
    .then(() => {
      dispatch(updateAppLocale(localeString));
    })
    .catch(err => {
      console.log(err);
    });
};

export const appInitialized = bool => ({
  type: ActionTypes.APP_FINISH_INIT,
  payload: bool
});

export const appLocale = locale => ({
  type: ActionTypes.SET_APP_LOCALE,
  payload: locale
});

export const updateAppLocale = localeString => ({
  type: ActionTypes.UPDATE_APP_LOCALE,
  payload: localeString
});

export const updateAppPermission = (type, value) => ({
  type: ActionTypes.UPDATE_APP_PERMISSION,
  payload: { type, value }
});

export const updateAppPermissionsOnInit = (camera, library, location) => ({
  type: ActionTypes.UPDATE_APP_PERMISSIONS_INIT,
  payload: {
    cameraPermission: camera,
    libraryPermission: library,
    locationPermission: location
  }
});
