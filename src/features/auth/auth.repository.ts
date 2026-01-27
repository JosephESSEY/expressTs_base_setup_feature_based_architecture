import db from '../../shared/database/client';
import { User } from './auth.model';

export class UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const q = `SELECT id, full_name, email, password_hash, role, created_at FROM users WHERE email = $1`;
    const r = await db.query(q, [email]);
    return r.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const q = `SELECT id, full_name, email, role, created_at FROM users WHERE id = $1`;
    const r = await db.query(q, [id]);
    return r.rows[0] || null;
  }

  async createUser(full_name: string, email: string, password_hash: string, role = 'user'): Promise<User> {
    const q = `
      INSERT INTO users (full_name, email, password_hash, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING full_name, created_at
    `;
    const r = await db.query(q, [full_name, email, password_hash, role]);
    return r.rows[0];
  }
}
