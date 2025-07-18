// Authentication service for iLoccar

import { User, LoginCredentials } from '@/types';


const AUTH_STORAGE_KEY = 'iloccar_auth_user';

export class AuthService {
  // Simulate authentication API call
  static async authenticate(credentials: LoginCredentials): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate auth with Supabase data
    return { id: '1', name: 'Test User', email: credentials.email, role: 'cliente' } as User;
    
  }

  static getCurrentUser(): User | null {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    return user.role === requiredRole;
  }
}