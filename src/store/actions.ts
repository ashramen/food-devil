import { ActionType } from './actionTypes';

export const logIn = (username: string, token: string) => ({
    type: ActionType.LOG_IN,
    payload: {
        username,
        token
    }
})

export const logOut = () => ({
    type: ActionType.LOG_OUT,
})