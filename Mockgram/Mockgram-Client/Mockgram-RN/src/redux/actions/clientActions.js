import { SecureStore } from "expo";

import * as ActionTypes from "./ActionTypes";
import * as LocalKeys from "../../common/localKeys";
import baseUrl from "../../common/baseUrl";
import { createSocket } from "../../utils/socket";

export const clientLogin = loginForm => dispatch => {
  return fetch(`${baseUrl.api}/user/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: loginForm.loginName,
      password: loginForm.loginPassword
    })
  })
    .then(res => res.json())
    .then(resJson => {
      if (resJson.status === 200) {
        // login success
        let clientInfo = {
          token: resJson.token,
          user: resJson.user
        };
        dispatch(loginSucess(clientInfo));
        dispatch(connectSocket(createSocket(baseUrl.socket, clientInfo)));
        return Promise.resolve(clientInfo);
      } else {
        // login failed
        let errMsg = resJson.msg;
        dispatch(loginError(errMsg));
        return Promise.reject(errMsg);
      }
    });
};

export const oAuthLogin = clientInfo => dispatch => {
  dispatch(loginSucess(clientInfo));
  dispatch(connectSocket(createSocket(baseUrl.socket, clientInfo)));
};

export const clientLogout = () => dispatch => {
  return;
};

export const getClientInfo = () => dispatch => {
  return SecureStore.getItemAsync(LocalKeys.CLIENT_INFO).then(info => {
    if (info) {
      let clientInfo = JSON.parse(info);
      return fetch(`${baseUrl.api}/user/token/verify`, {
        headers: {
          authorization: clientInfo.token
        },
        method: "GET"
      })
        .then(res => res.json())
        .then(resJson => {
          if (resJson.status !== 200) {
            // token is expired
            console.log("local token expired");
            return SecureStore.deleteItemAsync(LocalKeys.CLIENT_INFO).then(
              () => {
                console.log("removed local client infomation");
                dispatch(removeClientInfo());
              }
            );
          } else {
            dispatch(addClientInfo(clientInfo));
            dispatch(connectSocket(createSocket(baseUrl.socket, clientInfo)));
          }
        });
    } else {
      dispatch(removeClientInfo());
    }
  });
};

// dispatch objects
export const loginSucess = clientInfo => ({
  type: ActionTypes.CLIENT_LOGIN,
  payload: clientInfo
});

export const loginError = err => ({
  type: ActionTypes.CLIENT_LOGIN_FAILED,
  payload: err
});

export const removeClientInfo = () => ({
  type: ActionTypes.REMOVE_CLIENT_INFO
});

export const addClientInfo = clientInfo => ({
  type: ActionTypes.ADD_CLIENT_INFO,
  payload: clientInfo
});

export const connectSocket = socket => ({
  type: ActionTypes.CONNECT_SOCKET,
  payload: socket
});
