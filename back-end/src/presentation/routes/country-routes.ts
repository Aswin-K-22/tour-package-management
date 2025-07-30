    // src/presentation/routes/country-routes.ts

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
     // Get list of countries (admin and normal auth allowed)
    this.router.get(
      '/countries',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.countryController.getAll.bind(this.countryController)
    );

    // Edit a country by ID (admin only)
    this.router.put(
      '/:id',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.countryController.update.bind(this.countryController)
    );

    // Delete a country by ID (admin only)
    this.router.delete(
      '/:id',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.countryController.delete.bind(this.countryController)
    );

this.router.get(
  '/countries/alpha',
  this.authMiddleware.adminAuth.bind(this.authMiddleware),
  this.countryController.getAllAlpha.bind(this.countryController)
);


    this.router.post('/create' , this.authMiddleware.adminAuth.bind(this.authMiddleware),this.countryController.create.bind(this.countryController))
}
}