import { MEALS, GET_MEAL, fetchData } from './constants';
import { NutritionStats } from '../util/translateData';

export const getMealByDays = async (id: string, token: string, days: Date[]) => {
    const data = fetchData(GET_MEAL(id), 'GET', token);
    // TODO: Post-processing
    return data;
}

export const postMeal = async(userId: string, foods: string[], token: string) => {
    const body = {
        user_id: userId,
        foods
    };
    return fetchData(MEALS, 'POST', token, body);
}

export const patchMeal = async(id: string, foods: string[], token: string) => {
    const body = {
        foods
    };
    return fetchData(GET_MEAL(id), 'PATCH', token, body);
}

export const deleteMeal = async(id: string, token: string) => {
    return fetchData(GET_MEAL(id), 'DELETE', token);
}