import { RESTAURANTS, fetchData } from './constants';

export const getRestaurants = async (token: string) => {
    return fetchData(RESTAURANTS, 'GET', token);
}