const BASEPATH = 'https://food-devil-backend.herokuapp.com';
export const FOODS = '/foods';
export const SIGNUP = '/users/signup';
export const LOGIN = '/users/login';
export const RESTAURANTS = '/restaurants';
export const GET_USER_ID = (username: string) => '/users/' + username;

export const fetchData = async (route: string, method: string, token?: string, body?: any) => {
    let headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers = {
            ...headers,
            'Authorization': 'Bearer ' + token,
        };
    }

    let fetchInfo: RequestInit = {
        method,
        headers,
    }

    if (body) {
        fetchInfo = {
            ...fetchInfo,
            body: JSON.stringify(body),
        }
    }

    const response = await fetch(BASEPATH + route, fetchInfo);
    return await response.json();
}