import * as ActionTypes from './ActionTypes';
import baseUrl from '../../common/baseUrl';

export const getMessage = (token) => dispatch => {
    if (token) {
        return fetch(`${baseUrl.api}/message/new`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(res => res.json()).then(resJson => {
            if (resJson.status === 200) {
                let messages = resJson.data;
                dispatch(addMessage(messages));
            } else {
                let errMsg = resJson.msg;
                dispatch(addMessageFailed(errMsg));
            }
        })
    }
    return;
}

export const updateLastMessageId = () => {
    return {
        type: ActionTypes.UPDATE_LAST_MESSAGE_ID
    }
}

export const addMessage = (messages) => ({
    type: ActionTypes.RECEIVE_MESSAGE,
    payload: messages
})


export const addMessageFailed = (err) => ({
    type: ActionTypes.MESSAGE_ERROR,
    payload: err
})

export const recallMessage = (message) => ({
    type: ActionTypes.RECALL_MESSAGE,
    payload: message
})