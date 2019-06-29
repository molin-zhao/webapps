import * as ActionTypes from "../actions/ActionTypes";
import * as Types from "../../common/types";
import {
  concatArrayWithData,
  removeItemFromArrayWithItemId
} from "../../utils/arrayEditor";

export const profile = (
  state = {
    profile: null,
    errMsg: null,
    created: {
      data: [],
      hasMore: true
    },
    liked: {
      data: [],
      hasMore: true
    },
    mentioned: {
      data: [],
      hasMore: true
    }
  },
  action
) => {
  let { data, type, error, hasMore } = action.payload ? action.payload : {};
  switch (action.type) {
    case ActionTypes.ADD_CLIENT_PROFILE:
      return { ...state, profile: data, errMsg: null };
    case ActionTypes.ADD_CLIENT_PROFILE_FAILED:
      return { ...state, profile: null, errMsg: error };
    case ActionTypes.ADD_CLIENT_PROFILE_POST:
      if (data && type === Types.CREATED_POST) {
        return {
          ...state,
          created: {
            data: concatArrayWithData(state.created.data, data),
            hasMore
          }
        };
      } else if (data && type === Types.LIKED_POST) {
        return {
          ...state,
          liked: {
            data: concatArrayWithData(state.liked.data, data),
            hasMore
          }
        };
      } else if (data && type === Types.MENTIONED_POST) {
        return {
          ...state,
          mentioned: {
            data: concatArrayWithData(state.mentioned.data, data),
            hasMore
          }
        };
      } else {
        return { ...state };
      }
    case ActionTypes.REMOVE_CLIENT_PROFILE_POST:
      if (data && type === Types.CREATED_POST) {
        return {
          ...state,
          created: {
            data: removeItemFromArrayWithItemId(state.created.data, data)
          }
        };
      } else if (data && type === Types.LIKED_POST) {
        return {
          ...state,
          liked: {
            data: removeItemFromArrayWithItemId(state.liked.data, data)
          }
        };
      } else if (data && type === Types.MENTIONED_POST) {
        return {
          ...state,
          mentioned: {
            data: removeItemFromArrayWithItemId(state.mentioned.data, data)
          }
        };
      } else {
        return { ...state };
      }
    case ActionTypes.RELOAD_CLIENT_PROFILE_POST:
      if (data && type === Types.CREATED_POST) {
        return { ...state, created: { data: data.old, hasMore } };
      } else if (data && type === Types.LIKED_POST) {
        return { ...state, liked: { data: data.old, hasMore } };
      } else if (data && type === Types.MENTIONED_POST) {
        return { ...state, mentioned: { data: data.old, hasMore } };
      } else {
        return state;
      }
    case ActionTypes.UPDATE_CLIENT_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          avatar: data.avatar,
          nickname: data.nickname,
          bio: data.bio
        }
      };
    case ActionTypes.REMOVE_CLIENT_PROFILE_AVATAR:
      return { ...state, profile: { ...state.profile, avatar: "" } };
    case ActionTypes.ADD_TO_TOP_CLIENT_PROFILE_POST:
      switch (type) {
        case Types.CREATED_POST:
          return {
            ...state,
            created: { ...state.created, data: data.concat(state.created.data) }
          };
        case Types.LIKED_POST:
          return {
            ...state,
            liked: { ...state.liked, data: data.concat(state.liked.data) }
          };
        case Types.MENTIONED_POST:
          return {
            ...state,
            mentioned: {
              ...state.mentioned,
              data: data.concat(state.mentioned.data)
            }
          };
        default:
          return { ...state };
      }
    default:
      return state;
  }
};
