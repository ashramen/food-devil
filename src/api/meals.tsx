import { MEALS, GET_MEAL, GET_USER_MEAL, fetchData, GET_MEALS_BY_RESTAURANT } from './constants';
import { getFood } from './foods';
import { Food, NutritionStats, translateData } from '../util/translateData';

export const getMealByDays = async (id: string, token: string, days: Date[]) => {
    const data = await fetchData(GET_USER_MEAL(id), 'GET', token);
    const nutritionInfoPerDay: NutritionStats[] = [];
    for (const date of days) {
        const filteredData = data.filter((meal: any) => {
            const mealDate: Date = new Date(meal.createdAt);
            return (
                mealDate.getDate() === date.getDate()
                && mealDate.getMonth() === date.getMonth()
                && mealDate.getFullYear() === date.getFullYear()
            )
        });
        const allFoods = [];
        for (const meal of filteredData) {
            for (const foodId of meal.foods) {
                const foodInfo: Food = await getFood(foodId, token) as Food;
                allFoods.push(foodInfo);
            }
        }
        const nutritionInfo: NutritionStats = translateData(allFoods);
        nutritionInfoPerDay.push(nutritionInfo);
    }
    return nutritionInfoPerDay;
}

export const postMeal = async (userId: string, foods: string[], token: string) => {
    const body = {
        user_id: userId,
        foods,
    };
    return fetchData(MEALS, 'POST', token, body);
}

export const patchMeal = async (id: string, foods: string[], token: string) => {
    const body = {
        foods
    };
    return fetchData(GET_MEAL(id), 'PATCH', token, body);
}

export const deleteMeal = async (id: string, token: string) => {
    return fetchData(GET_MEAL(id), 'DELETE', token);
}


export const getMealByRestaurant = async (userId: string, restaurantId: string, token: string) => {
    const body = {
        user_id: userId,
        restaurantId: restaurantId
    };

    console.log("HERE");
    console.log(body);
    return fetchData(GET_MEALS_BY_RESTAURANT, 'POST', token, body);
}
