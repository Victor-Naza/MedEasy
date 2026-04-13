import { User } from '../models/User';

const API_BASE_URL = 'http://localhost:5000/api/auth';
const TOKEN_KEY = 'medicalToken';

export class AuthController {
  static async register(name: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar conta');
    }

    sessionStorage.setItem(TOKEN_KEY, data.token);
    return User.fromJSON(data.user);
  }

  static async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    sessionStorage.setItem(TOKEN_KEY, data.token);
    return User.fromJSON(data.user);
  }

  static async getMe(): Promise<User | null> {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        sessionStorage.removeItem(TOKEN_KEY);
        return null;
      }

      return User.fromJSON(await response.json());
    } catch {
      return null;
    }
  }

  static logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  static getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }
}
