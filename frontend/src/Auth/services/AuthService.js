import IAuthService from './IAuthService.js';

export default class AuthService extends IAuthService {
  async login(email, password) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  }

  async register(username, email, password) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  }
}