const basePath = 'https://food-devil-backend.herokuapp.com';

export const getRestaurants = async (token: string) => {
    const route = '/restaurants';
    const response = await fetch(basePath + route, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
}