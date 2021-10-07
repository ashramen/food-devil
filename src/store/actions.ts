import { ActionType } from './actionTypes';

export const logIn = (username: string) => ({
    type: ActionType.LOG_IN,
    payload: {
        username
    }
})


export const logOut = () => ({
    type: ActionType.LOG_OUT,
})