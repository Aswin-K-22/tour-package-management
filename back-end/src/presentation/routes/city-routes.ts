import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { CityController } from '../controllers/CityController';

export class CityRoutes {
  public router: Router;

  constructor(
    private cityController: CityController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    console.log('Setting up city routes');

    // Get list of cities (admin and normal auth allowed)
    this.router.get(
      '/cities',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.cityController.getAll.bind(this.cityController)
    );

    // Get list of cities sorted alphabetically (if applicable)
    this.router.get(
      '/cities/alpha',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.cityController.getAllAlpha.bind(this.cityController)
    );

    // Create a new city (admin only)
    this.router.post(
      '/create',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.cityController.create.bind(this.cityController)
    );

    // Edit a city by ID (admin only)
    this.router.put(
      '/:id',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.cityController.update.bind(this.cityController)
    );

    // Delete a city by ID (admin only)
    this.router.delete(
      '/:id',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.cityController.delete.bind(this.cityController)
    );

    this.router.get(
  '/by-country/:countryId',
  this.authMiddleware.adminAuth.bind(this.authMiddleware),
  this.cityController.getByCountryId.bind(this.cityController)
);

  }
}
