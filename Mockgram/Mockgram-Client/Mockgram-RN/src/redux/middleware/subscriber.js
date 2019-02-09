import store from '../';

export const socketListener = () => {
    let state = store.getState();
    let socket = state.message.socket;
    return socket;
}