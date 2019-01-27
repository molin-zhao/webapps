import { combineReducers } from 'redux';

import { client } from './clientReducers';
import { message } from './messageReducers';
import { profile } from './profileReducers';
import { feed } from './feedReducers';

export default reducers = combineReducers({
    client,
    message,
    profile,
    feed
})
