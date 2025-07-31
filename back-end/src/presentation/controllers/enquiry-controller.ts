import { Request, Response } from 'express';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { CreateEnquiryUseCase } from '@/application/usecases/enquiry/createEnquiryUseCase';
import { GetAllEnquiriesUseCase } from '@/application/usecases/enquiry/getEnquiriesUseCase';


export class EnquiryController {
  constructor(
    private createEnquiryUseCase: CreateEnquiryUseCase,
    private getAllEnquiriesUseCase: GetAllEnquiriesUseCase,
  ) {}

 private sendResponse<T>(res: Response, result: IResponseDTO<T> | any): void {
  const { success, message, status, data, meta } = result;

  res.status(status).json({
    success,
    message,
    ...(data ? { data } : {}),
    ...(meta ? { meta } : {}),
  });
}


async create(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, message, package: packageId, schedule } = req.body;

    const result = await this.createEnquiryUseCase.execute({
      name,
      email,
      phone,
      message,
      package: packageId,
      ...(schedule && { schedule })  
    });

    this.sendResponse(res, result);
  } catch (error) {
    console.error('Error in EnquiryController.create:', error);
    this.sendResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal server error',
    });
  }
}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.getAllEnquiriesUseCase.execute(Number(page), Number(limit));
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in EnquiryController.getAll:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
