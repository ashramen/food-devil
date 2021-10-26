import { FOODS, fetchData } from './constants';

export const getAllFoods = async (token: string) => {
    return fetchData(FOODS, 'GET', token);
}