const BASEPATH = 'https://food-devil-backend.herokuapp.com';
export const FOODS = '/foods';
export const GET_FOOD = (id: string) => '/foods/' + id;
export const GET_FOODS_BY_RESTAURANT = (id: string) => `/foods/restaurant/${id}`;
export const SIGNUP = '/users/signup';
export const LOGIN = '/users/login';
export const MEALS = '/meals/';
export const GET_MEAL = (id: string) => '/meals/' + id;
export const GET_USER_MEAL = (id: string) => '/meals/getUserMeals/' + id;
export const RESTAURANTS = '/restaurants';
export const GET_RESTAURANT = (id: string) => '/restaurants/' + id;
export const REVIEWS = '/reviews/';
export const GET_REVIEW = (id: string) => '/reviews/' + id;
export const GET_RESTAURANT_REVIEW = (id: string) => '/reviews/getRestaurantReviews/' + id;
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