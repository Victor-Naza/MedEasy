import { User } from '../models/User';
import { UserRole } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export class AuthController {
  static async login(email: string, password: string, crm?: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          crm // ← ADICIONADO CRM
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      const user = User.fromJSON(data.user);

      // Salva token e dados do usuário no localStorage
      localStorage.setItem('medicalToken', data.token);
      localStorage.setItem('medicalUser', JSON.stringify(user.toJSON()));

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao conectar com o servidor');
    }
  }

  static async register(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    crm?: string
  ): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          crm: crm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }

      const user = User.fromJSON(data.user);

      localStorage.setItem('medicalToken', data.token);
      localStorage.setItem('medicalUser', JSON.stringify(user.toJSON()));

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao conectar com o servidor');
    }
  }

  static logout(): void {
    localStorage.removeItem('medicalToken');
    localStorage.removeItem('medicalUser');
  }

  static getCurrentUser(): User | null {
    const userData = localStorage.getItem('medicalUser');
    if (userData) {
      return User.fromJSON(JSON.parse(userData));
    }
    return null;
  }

  static getToken(): string | null {
    return localStorage.getItem('medicalToken');
  }
}