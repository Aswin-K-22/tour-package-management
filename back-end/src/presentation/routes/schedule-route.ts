import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/multer'; // ✅ for handling images
import { ScheduleController } from '../controllers/shedule-controller';

export class ScheduleRoutes {
  public router: Router;

  constructor(
    private scheduleController: ScheduleController,
    private authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    console.log('Setting up schedule routes');

    // ✅ Get all schedules
    this.router.get(
      '/all',
    //  this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.scheduleController.getAllSchedules.bind(this.scheduleController)
    );

    this.router.get(
  '/get/:id',
  this.scheduleController.getScheduleById.bind(this.scheduleController)
);


    // ✅ Create a new schedule with image(s)
    this.router.post(
      '/create',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      upload.array('photos', 5), // adjust field name as per your frontend
      this.scheduleController.createSchedule.bind(this.scheduleController)
    );

    // ✅ Update a schedule (images optional)
    this.router.put(
      '/update/:id',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      upload.array('photos', 5),
      this.scheduleController.updateSchedule.bind(this.scheduleController)
    );

    // ✅ Delete schedule
    this.router.delete(
      '/delete/:id',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.scheduleController.deleteSchedule.bind(this.scheduleController)
    );

    // ✅ Get schedule by ID (optional)
    this.router.get(
      '/:id',
      this.authMiddleware.adminAuth.bind(this.authMiddleware),
      this.scheduleController.getScheduleById.bind(this.scheduleController)
    );
  }
}
