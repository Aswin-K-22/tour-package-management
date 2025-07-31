import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { PackageController } from '../controllers/package-controller';
import { upload } from '../middlewares/multer';


export class PackageRoutes {
  public router: Router;

  constructor(
    private packageController: PackageController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    console.log('Setting up tour package routes');

    // Get paginated list of packages (auth required)
    this.router.get(
      '/packages',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.packageController.getAll.bind(this.packageController)
    );

    // Create a new tour package with multiple images
    this.router.post(
      '/create',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      upload.array('photos', 10), 
      this.packageController.create.bind(this.packageController)
    );

    // Edit an existing package (with optional image upload)
    this.router.put(
  '/update/:id',
  this.authMiddleware.adminAuth.bind(this.authMiddleware),
  upload.array('photos', 10),
  this.packageController.update.bind(this.packageController)
);

    // this.router.put(
    //   '/:id',
    //   this.authMiddleware.adminAuth.bind(this.authMiddleware),
    //   upload.array('photos', 10),
    //   this.packageController.update.bind(this.packageController)
    // );

    // Delete a package by ID
this.router.delete(
  '/delete/:id',
  this.authMiddleware.adminAuth.bind(this.authMiddleware),
  this.packageController.delete.bind(this.packageController)
);
  }
}
