import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry-controller';

export class EnquiryRoutes {
  public router: Router;

  constructor(private enquiryController: EnquiryController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/create', this.enquiryController.create.bind(this.enquiryController));
    this.router.get('/enquiries', this.enquiryController.getAll.bind(this.enquiryController));
  }
}
