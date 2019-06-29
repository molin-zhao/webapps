import * as ActionTypes from "../actions/ActionTypes";
import * as LocalKeys from "../../common/localKeys";

export const app = (
  state = {
    initialized: false,
    appLocale: "en-GB",
    cameraPermission: false,
    libraryPermission: false,
    locationPermission: false
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.APP_FINISH_INIT:
      return { ...state, initialized: action.payload };
    case ActionTypes.SET_APP_LOCALE:
      return { ...state, appLocale: action.payload };
    case ActionTypes.UPDATE_APP_LOCALE:
      return { ...state, appLocale: action.payload };
    case ActionTypes.UPDATE_APP_PERMISSION:
      switch (action.payload.type) {
        case LocalKeys.PERMISSION_CAMERA:
          return { ...state, cameraPermission: action.payload.value };
        case LocalKeys.PERMISSION_LIBRARY:
          return { ...state, libraryPermission: action.payload.value };
        case LocalKeys.PERMISSION_LOCATION:
          return { ...state, locationPermission: action.payload.value };
        default:
          return { ...state };
      }
    default:
      return state;
  }
};
