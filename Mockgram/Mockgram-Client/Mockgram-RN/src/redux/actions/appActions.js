import * as ActionTypes from "./ActionTypes";

export const finishAppInitialize = () => dispatch => {
  console.log("finish app initialize");
  dispatch(appInitialized(true));
};

export const appInitialized = bool => ({
  type: ActionTypes.APP_FINISH_INIT,
  payload: bool
});
