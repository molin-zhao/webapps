import UserTypes from '../actions/UserTypes';

const initialState = {
    isLoggin: false
}
export const user = (state = initialState, action) => {
    switch (action.type) {
        case UserTypes.USER_LOGGIN:
            return { ...state, isLoggin: true };
        default:
            return state;
    }
};