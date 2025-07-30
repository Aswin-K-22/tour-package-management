import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { AuthController } from '../controllers/auth-controller';

export class AuthRoutes {
  public router: Router;

  constructor(
    private authController: AuthController,
    private authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public routes
    console.log('Setting up auth routes');

    this.router.post('/create', this.authController.create.bind(this.authController));
    this.router.post('/login', this.authController.login.bind(this.authController));
    this.router.post('/logout', this.authMiddleware.adminAuth.bind(this.authMiddleware), this.authController.logout.bind(this.authController));
    this.router.get('/get', this.authMiddleware.adminAuth.bind(this.authMiddleware), this.authController.get.bind(this.authController));
  }
}