import * as ActionTypes from './ActionTypes';

export const finishAppInitialize = () => ({
    type: ActionTypes.APP_FINISH_INIT,
    payload: true
})

export const popUpInput = () => ({
    type: ActionTypes.POP_UP_TEXT_INPUT
})

export const dismissInput = () => ({
    type: ActionTypes.DISMISS_TEXT_INPUT
})