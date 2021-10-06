import { combineReducers } from 'redux';
import logInReducer from './reducers/logInReducer';

const reducers = combineReducers({
    logIn: logInReducer,
})

export default reducers;
export type State = ReturnType<typeof reducers>;