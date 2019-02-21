import store from '../';

export const socketListener = async () => {
    let state = store.getState();
    return state.message.socket;
}

export const clientListener = async () => {
    let state = store.getState();
    return state.client.client;
}