import * as ActionTypes from "../actions/ActionTypes";

export const app = (
  state = {
    initialized: false,
    i18n: null
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.APP_FINISH_INIT:
      return { ...state, initialized: action.payload };
    case ActionTypes.SET_APP_LOCALE:
      return { ...state, i18n: action.payload };
    default:
      return state;
  }
};
