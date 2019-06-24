import * as ActionTypes from "../actions/ActionTypes";
import { Localization } from "expo";

export const app = (
  state = {
    initialized: false,
    appLocale: null
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
    default:
      return state;
  }
};
