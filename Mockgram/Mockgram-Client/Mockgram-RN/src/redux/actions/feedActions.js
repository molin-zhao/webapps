import * as ActionTypes from "./ActionTypes";

export const addAImage = imageUri => ({
  type: ActionTypes.ADD_A_IMAGE,
  payload: imageUri
});

export const removeAImage = uri => ({
  type: ActionTypes.REMOVE_A_IMAGE,
  payload: uri
});
export const reloadHomeFeed = feeds => ({
  type: ActionTypes.RELOAD_HOME_FEED,
  payload: feeds
});

export const updateHomeFeed = feeds => ({
  type: ActionTypes.UPDATE_HOME_FEED,
  payload: feeds
});

export const addToHeadOfHomeFeed = feed => ({
  type: ActionTypes.ADD_TO_HEAD_HOME_FEED,
  payload: feed
});

export const uploadingPost = () => ({
  type: ActionTypes.UPLOADING_POST
});

export const uploadedPost = () => ({
  type: ActionTypes.UPLOADED_POST
});
