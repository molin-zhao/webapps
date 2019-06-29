import * as ActionTypes from "./ActionTypes";

import baseUrl from "../../common/baseUrl";

export const getClientProfile = token => dispatch => {
  return fetch(`${baseUrl.api}/profile/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token
    }
  })
    .then(res => res.json())
    .then(resJson => {
      if (resJson.status === 200) {
        let profile = resJson.data;
        dispatch(addClientProfile(profile));
      } else {
        let errMsg = resJson.msg;
        dispatch(addClientProfileFailed(errMsg));
      }
    })
    .catch(err => {
      dispatch(addClientProfileFailed(err));
    });
};

export const addClientProfile = clientProfile => ({
  type: ActionTypes.ADD_CLIENT_PROFILE,
  payload: { data: clientProfile }
});

export const updateClientProfile = profile => ({
  type: ActionTypes.UPDATE_CLIENT_PROFILE,
  payload: { data: profile }
});

export const addClientProfileFailed = err => ({
  type: ActionTypes.ADD_CLIENT_PROFILE_FAILED,
  payload: { error: err }
});

export const addClientProfilePosts = (type, data, hasMore) => ({
  type: ActionTypes.ADD_CLIENT_PROFILE_POST,
  payload: { type, data, hasMore }
});

export const removeClientProfilePost = (type, data) => ({
  type: ActionTypes.REMOVE_CLIENT_PROFILE_POST,
  payload: { type, data }
});

export const reloadClientProfilePosts = (type, data, hasMore) => ({
  type: ActionTypes.RELOAD_CLIENT_PROFILE_POST,
  payload: { type, data, hasMore }
});

export const removeClientProfileAvatar = () => ({
  type: ActionTypes.REMOVE_CLIENT_PROFILE_AVATAR
});

export const addToTopClientProfilePost = (type, data) => ({
  type: ActionTypes.ADD_TO_TOP_CLIENT_PROFILE_POST,
  payload: { type, data }
});
