import { ActionType } from './actionTypes';

export const logIn = (username: string, userId: string, token: string) => ({
    type: ActionType.LOG_IN,
    payload: {
        username,
        userId,
        token,
    }
})

export const logOut = () => ({
    type: ActionType.LOG_OUT,
})