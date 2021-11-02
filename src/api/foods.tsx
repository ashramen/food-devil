import { FOODS, GET_FOOD, fetchData } from './constants';

export const getAllFoods = async (token: string) => {
    return fetchData(FOODS, 'GET', token);
}

export const getFood = async (id: string, token: string) => {
    return fetchData(GET_FOOD(id), 'GET', token);
}