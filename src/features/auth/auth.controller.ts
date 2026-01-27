import { Request, Response } from 'express';
import { UsersService } from './auth.service';
import { getMissingFields } from '../../shared/utils/validators';

export class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  public async register(req: Request, res: Response) {
    const required = ['full_name', 'email', 'password', 'role'];
    const missing = getMissingFields(req.body, required);
    if (missing.length) return res.status(400).json({ success: false, error: 'Champs manquants', missing });

    try {
      const { full_name, email, password, role } = req.body;
      const user = await this.service.register(full_name, email, password, role);
      return res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', user });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Erreur serveur', error: err });
    }
  }

  public async login(req: Request, res: Response) {
    const required = ['email', 'password'];
    const missing = getMissingFields(req.body, required);
    if (missing.length) return res.status(400).json({ success: false, error: 'Champs manquants', missing });

    try {
      const { email, password } = req.body;
      const { token } = await this.service.login(email, password);
      return res.status(200).json({ success: true, message: 'Connexion réussie', token });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Erreur serveur', error: err });
    }
  }

  public async profile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });

      const user = await this.service.profile(userId);
      return res.status(200).json({ success: true, user });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Erreur serveur', error: err });
    }
  }
}
