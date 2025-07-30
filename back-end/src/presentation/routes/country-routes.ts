import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { CountryController } from '../controllers/country-controller';


export class CountryRoutes {
  public router: Router;

  constructor(
    private countryController: CountryController,
    private  authMiddleware :  AuthMiddleware , 
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public routes
    console.log('Setting up user routes');

    this.router.post('/create' , this.authMiddleware.adminAuth.bind(this.authMiddleware),this.countryController.create.bind(this.countryController))
}
}