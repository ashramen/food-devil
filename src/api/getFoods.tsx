const basePath = 'https://food-devil-backend.herokuapp.com';

export const getAllFoods = async (token: string) => {
    const route = '/foods';
    const response = await fetch(basePath + route, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
}