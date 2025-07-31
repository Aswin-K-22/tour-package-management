import { Request, Response } from 'express';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { S3Service } from '@/infrastructure/services/S3Service';
import { v4 as uuidv4 } from 'uuid';
import { CreateScheduleUseCase } from '@/application/usecases/shedule/CreateScheduleUseCase';
import { UpdateScheduleUseCase } from '@/application/usecases/shedule/UpdateScheduleUseCase';
import { DeleteScheduleUseCase } from '@/application/usecases/shedule/DeleteScheduleUseCase';
import { GetAllSchedulesUseCase } from '@/application/usecases/shedule/GetAllSchedulesUseCase';
import { GetScheduleByIdUseCase } from '@/application/usecases/shedule/GetScheduleByIdUseCase';

export class ScheduleController {
  private s3Service: S3Service;

  constructor(
    private createScheduleUseCase: CreateScheduleUseCase,
    private updateScheduleUseCase: UpdateScheduleUseCase,
    private deleteScheduleUseCase: DeleteScheduleUseCase,
    private getAllSchedulesUseCase: GetAllSchedulesUseCase,
    private getScheduleByIdUseCase: GetScheduleByIdUseCase,
  ) {
    this.s3Service = new S3Service();
  }

  private sendResponse<T>(res: Response, result: IResponseDTO<T>): void {
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      ...(result.success && result.data ? { data: result.data } : {}),
    });
  }

  async createSchedule(req: Request, res: Response) {
    try {
      const { title, packageId, fromDate, toDate, amount, description } = req.body;

      if (!title || !packageId || !fromDate || !toDate || !amount) {
        return this.sendResponse(res, {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Missing required fields',
        });
      }

      // Upload photos to S3
      const files = (req.files as Express.Multer.File[]) || [];
      const uploadedKeys: string[] = [];

      for (const file of files) {
        const key = `schedules/${uuidv4()}-${file.originalname}`;
        await this.s3Service.uploadFile(file, key);
        uploadedKeys.push(key);
      }

      const result = await this.createScheduleUseCase.execute({
        title,
        packageId,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        amount: parseFloat(amount),
        description,
        photos: uploadedKeys,
      });

      this.sendResponse(res, result);
    } catch (error: any) {
      console.error('Error in ScheduleController.createSchedule:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error?.message || 'Internal server error',
      });
    }
  }

  async updateSchedule(req: Request, res: Response) {
    const scheduleId = req.params.id;

    try {
      const { title,  packageId, fromDate, toDate, amount, description, deletePhotoKeys } = req.body;

      // Parse keys to delete (optional)
      let deletedKeys: string[] = [];
      if (deletePhotoKeys) {
        try {
          deletedKeys = Array.isArray(deletePhotoKeys)
            ? deletePhotoKeys
            : typeof deletePhotoKeys === 'string'
              ? JSON.parse(deletePhotoKeys)
              : [deletePhotoKeys];
        } catch (err) {
          return this.sendResponse(res, {
            status: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'Invalid deletePhotoKeys format',
          });
        }
      }

      // Upload new photos
      const files = (req.files as Express.Multer.File[]) || [];
      const uploadedKeys: string[] = [];

      for (const file of files) {
        const key = `schedules/${uuidv4()}-${file.originalname}`;
        await this.s3Service.uploadFile(file, key);
        uploadedKeys.push(key);
      }

      const result = await this.updateScheduleUseCase.execute({
        scheduleId,
        title,
        packageId,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        amount: parseFloat(amount),
        description,
        newPhotos: uploadedKeys,
        deletePhotoKeys: deletedKeys,
      });

      this.sendResponse(res, result);
    } catch (error: any) {
      console.error('Error in ScheduleController.updateSchedule:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error?.message || 'Internal server error',
      });
    }
  }

  async deleteSchedule(req: Request, res: Response) {
    const scheduleId = req.params.id;

    try {
      const result = await this.deleteScheduleUseCase.execute(scheduleId);
      this.sendResponse(res, result);
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error?.message || 'Internal server error',
      });
    }
  }

  async getAllSchedules(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.getAllSchedulesUseCase.execute({ page, limit });
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

async getScheduleById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await this.getScheduleByIdUseCase.execute(id);
    this.sendResponse(res, result);
  } catch (error) {
    console.error('Error fetching schedule by ID:', error);
    this.sendResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal server error',
    });
  }
}
}
