import { UsersRepository } from './auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../../environment/env.config';
import { User } from './auth.model';

export class UsersService {
  private repo: UsersRepository;

  constructor() {
    this.repo = new UsersRepository();
  }

  public async register(full_name: string, email: string, password: string, role: string): Promise<User> {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw { statusCode: 400, message: 'Cet email est déjà utilisé' };

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await this.repo.createUser(full_name, email, hashed, role);

    // const token = jwt.sign({ id: newUser.id, pseudo: newUser.full_name }, env.JWT_SECRET, { expiresIn: '1d' });

    return newUser;
  }

  public async login(email: string, password: string): Promise<{ token: string }> {
    const existing = await this.repo.findByEmail(email);
    if (!existing || !existing.password_hash) throw { statusCode: 401, message: 'Email ou mot de passe incorrect' };

    const ok = await bcrypt.compare(password, existing.password_hash);
    if (!ok) throw { statusCode: 401, message: 'Email ou mot de passe incorrect' };

    const token = jwt.sign({ id: existing.id, full_name: existing.full_name, role: existing.role }, env.JWT_SECRET, { expiresIn: '1d' });
    return { token };
  }

  public async profile(userId: string): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) throw { statusCode: 404, message: 'Utilisateur introuvable' };
    return user;
  }
}
