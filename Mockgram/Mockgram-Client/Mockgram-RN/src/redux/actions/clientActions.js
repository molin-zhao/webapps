import { SecureStore } from 'expo';

import * as ActionTypes from './ActionTypes';
import * as LocalKeys from '../../common/localKeys';
import baseUrl from '../../common/baseUrl';
import { parseIdFromObjectArray } from '../../utils/idParser';

export const clientLogin = (loginForm) => (dispatch) => {
    return fetch(`${baseUrl.api}/user/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: loginForm.loginName,
            password: loginForm.loginPassword,
        }),
    }).then(res => res.json()).then(resJson => {
        if (resJson.status === 200) {
            // login success
            let clientInfo = {
                token: resJson.token,
                user: resJson.user
            }
            // global.socket = SocketIOClient(`${baseUrl.socket}`);
            // global.socket.emit('registerClient', { id: global.userinfo.user._id });
            console.log(clientInfo);
            dispatch(loginSucess(clientInfo));
            return Promise.resolve(clientInfo);
        } else {
            // login failed
            let errMsg = resJson.msg
            dispatch(loginError(errMsg));
            return Promise.reject(errMsg);
        }
    });
}

export const clientLogout = () => (dispatch) => {
    return
}

export const getClientProfile = (token) => (dispatch) => {
    return fetch(`${baseUrl.api}/profile/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: token
        },
    }).then(res => res.json()).then(resJson => {
        if (resJson.status === 200) {
            let profile = resJson.data;
            dispatch(addClientProfile(profile));
            return Promise.resolve(profile);
        } else {
            let errMsg = resJson.msg;
            dispatch(addClientProfileFailed(errMsg));
            return Promise.reject(errMsg);
        }
    })
}

export const getClientInfo = () => (dispatch) => {
    return SecureStore.getItemAsync(LocalKeys.CLIENT_INFO).then((info) => {
        if (info) {
            let clientInfo = JSON.parse(info);
            return fetch(`${baseUrl.api}/user/token/verify`, {
                headers: {
                    authorization: clientInfo.token
                },
                method: 'GET'
            }).then(res => res.json()).then(resJson => {
                if (resJson.status !== 200) {
                    // token is expired
                    console.log('local token expired');
                    return SecureStore.deleteItemAsync(LocalKeys.CLIENT_INFO).then(() => {
                        console.log('removed local client infomation');
                        dispatch(removeClientInfo());
                    });
                } else {
                    dispatch(addClientInfo(clientInfo));
                }
            })
        } else {
            dispatch(removeClientInfo());
        }
    })
}

export const getClientProfilePosts = (caller, dataSource, userId, type, limit, hotUpdate) => dispatch => {
    const url = `${baseUrl.api}/profile/post`;
    console.log(`fetching data from ${url}`);
    let lastData = dataSource == null ? caller.state.data : dataSource;
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            limit: limit,
            userId: userId,
            lastQueryDataIds: parseIdFromObjectArray(lastData),
            type: type,
            lastQueryDataLastItem: lastData.slice(-1),
        })
    }).then(res => res.json()).then(res => {
        if (dataSource) {
            if (caller.state.loadingMore) {
                dispatch(addClientProfilePosts(type, res.data));
            } else {
                dispatch(reloadClientProfilePosts(type, res.data));
            }
        } else {
            caller.setState({
                data: caller.state.loadingMore === true ? res.data.new.concat(caller.state.data).concat(res.data.old) : res.data.old,
            })
        }
        caller.setState({
            // data only appended when loading more, else refresh data
            error: res.status === 200 ? null : res.msg,
            hasMore: res.data.length < limit ? false : true,
            loading: false,
            refreshing: false,
            loadingMore: false,
        });
    }).catch(err => {
        console.log(err);
        caller.setState({ error: "some err", loading: false, refreshing: false, loadingMore: false });
    })
}

// dispatch objects
export const loginSucess = (clientInfo) => ({
    type: ActionTypes.CLIENT_LOGIN,
    payload: { data: clientInfo }
})

export const loginError = (err) => ({
    type: ActionTypes.CLIENT_LOGIN_FAILED,
    payload: { error: err }
});

export const removeClientInfo = () => ({
    type: ActionTypes.REMOVE_CLIENT_INFO
});

export const addClientInfo = (clientInfo) => ({
    type: ActionTypes.ADD_CLIENT_INFO,
    payload: { data: clientInfo }
})

export const addClientProfile = (clientProfile) => ({
    type: ActionTypes.GET_CLIENT_PROFILE,
    payload: { data: clientProfile }
})

export const addClientProfileFailed = (err) => ({
    type: ActionTypes.GET_CLIENT_PROFILE_FAILED,
    payload: { error: err }
})

export const addClientProfilePosts = (type, data) => ({
    type: ActionTypes.ADD_CLIENT_PROFILE_POST,
    payload: { type: type, data: data }
})

export const reloadClientProfilePosts = (type, data) => ({
    type: ActionTypes.RELOAD_CLIENT_PROFILE_POST,
    payload: { type: type, data: data }
})