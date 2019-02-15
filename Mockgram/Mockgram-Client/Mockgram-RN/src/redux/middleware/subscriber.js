import store from '../';

export const socketListener = () => {
    let state = store.getState();
    return state.message.socket;
}

export const clientListener = () => {
    let state = store.getState();
    return state.client.client;
}