import { Router } from 'express';
import { UsersController } from './auth.controller';
import { isAuthMiddleware } from '../../shared/middlewares/isAuth.middleware';
import { isAdminMiddleware } from "../../shared/middlewares/isAdmin.middleware";


const router = Router();
const ctrl = new UsersController();

router.post('/register', isAuthMiddleware, isAdminMiddleware, ctrl.register.bind(ctrl));
router.post('/login', ctrl.login.bind(ctrl));
router.get('/profile', isAuthMiddleware, ctrl.profile.bind(ctrl));

export default router;
