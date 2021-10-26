import { ActionType, Action } from '../actionTypes';

interface State {
    loggedIn: boolean;
    username: string | null;
    token: string;
};

const initialState: State = {
    loggedIn: false,
    username: null,
    token: '',
};

const logInReducer = (state: State = initialState, action: Action) => {
    switch(action.type) {
        case ActionType.LOG_IN:
            return {
                ...state,
                loggedIn: true,
                username: action.payload.username,
                token: action.payload.token,
            };
        case ActionType.LOG_OUT:
            return {
                ...state,
                loggedIn: false,
                username: null,
            }
        default:
            return state;
    }
}

export default logInReducer;