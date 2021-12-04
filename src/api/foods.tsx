import { FOODS, GET_FOOD, fetchData, GET_FOODS_BY_RESTAURANT } from './constants';

export const getAllFoods = async (token: string) => {
    return fetchData(FOODS, 'GET', token);
}

export const getFood = async (id: string, token: string) => {
    return fetchData(GET_FOOD(id), 'GET', token);
}

export const getFoodsByRestaurant = async(id: string) => {
    return fetchData(GET_FOODS_BY_RESTAURANT(id), 'GET')
}