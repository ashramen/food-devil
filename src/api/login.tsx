import { SIGNUP, LOGIN, fetchData } from './constants';

export const signup = async (full_name: string, username: string, password: string) => {
    const body = {
        full_name,
        username,
        password
    };
    return fetchData(SIGNUP, 'POST', undefined, body);
}

export const login = async (username: string, password: string) => {
    const body = {
        username,
        password
    };
    return fetchData(LOGIN, 'POST', undefined, body);
}