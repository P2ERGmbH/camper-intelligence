export interface User {
  id: number;
  email: string;
  role: 'client' | 'provider' | 'admin';
}
