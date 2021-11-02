import { RESTAURANTS, GET_RESTAURANT, fetchData } from './constants';

export const getRestaurants = async (token: string) => {
    return fetchData(RESTAURANTS, 'GET', token);
}

export const getRestaurant = async (id: string, token: string) => {
    return fetchData(GET_RESTAURANT(id), 'GET', token);
}