export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash?: string;
  role: string;
  created_at: Date;
}
