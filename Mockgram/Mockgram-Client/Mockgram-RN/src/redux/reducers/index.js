import { combineReducers } from 'redux';

import { client } from './clientReducers';
import { message } from './messageReducers';
import { profile } from './profileReducers';
import { feed } from './feedReducers';
import { app } from './appReducers';

export default reducers = combineReducers({
    app,
    client,
    message,
    profile,
    feed
})
