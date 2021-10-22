const basePath = 'https://food-devil-backend.herokuapp.com';

export const signup = async (full_name: string, username: string, password: string) => {
    const route = '/users/signup';
    const body = {
        full_name,
        username,
        password
    };
    const response = await fetch(basePath + route, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
}

export const login = async (username: string, password: string) => {
    const route = '/users/login';
    const body = {
        username,
        password
    };
    const response = await fetch(basePath + route, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
}