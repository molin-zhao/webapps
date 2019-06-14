import * as ActionTypes from "../actions/ActionTypes";

export const client = (
  state = {
    client: null,
    error: null
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.CLIENT_LOGIN:
      return { client: action.payload, error: null };
    case ActionTypes.CLIENT_LOGIN_FAILED:
      return { client: null, error: action.payload };
    case ActionTypes.CLIENT_LOGOUT:
      return {};
    case ActionTypes.ADD_CLIENT_INFO:
      return { client: action.payload, error: null };
    case ActionTypes.REMOVE_CLIENT_INFO:
      return { client: null, error: null };
    default:
      return state;
  }
};
