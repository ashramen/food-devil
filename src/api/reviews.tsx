import { REVIEWS, GET_REVIEW, GET_RESTAURANT_REVIEW, fetchData, GET_REVIEW_UPVOTE } from './constants';

export const getReviews = async (id: string, token: string) => {
    const data = fetchData(GET_RESTAURANT_REVIEW(id), 'GET', token);
    return data;
}

export const postReview = async (userId: string, restaurantId: string, desc: string, stars: number, isAnon: boolean, token: string) => {
    const body = {
        user_id: userId,
        restaurant_id: restaurantId,
        description: desc,
        stars,
        is_anonymous: isAnon
    };
    return fetchData(REVIEWS, 'POST', token, body);
}


export const upvoteReview = async (id: string, token: string) => {
    return fetchData(GET_REVIEW_UPVOTE(id), 'PATCH', token);
}

export const patchReview = async (id: string, desc: string, stars: number, isAnon: boolean, token: string) => {
    const body = {
        description: desc,
        stars,
        is_anonymous: isAnon
    };
    return fetchData(GET_REVIEW(id), 'PATCH', token, body);
}

export const deleteReview = async (id: string, token: string) => {
    return fetchData(GET_REVIEW(id), 'DELETE', token);
}