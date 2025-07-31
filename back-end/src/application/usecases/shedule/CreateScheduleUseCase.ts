import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { Schedule } from '@/domain/entities/schedule';
import { IScheduleRepository } from '@/domain/repositories/schedule-repository';
import { S3Service } from '@/infrastructure/services/S3Service';

export interface CreateScheduleDTO {
  title: string;
  packageId: string;
  fromDate: Date;
  toDate: Date;
  amount: number;
  description?: string;
  photos: string[]; // S3 keys
}

export class CreateScheduleUseCase {
  private s3Service: S3Service;

  constructor(private scheduleRepo: IScheduleRepository) {
    this.s3Service = new S3Service();
  }

  async execute(data: CreateScheduleDTO): Promise<IResponseDTO<Schedule & { photoUrls: string[] }>> {
    const { title, packageId, fromDate, toDate, amount, description, photos } = data;

    // Optional: validate date range
    if (new Date(fromDate) > new Date(toDate)) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: ERRORMESSAGES.INVALID_DATE_RANGE || 'Invalid schedule date range',
      };
    }

    // Save to DB
    const created = await this.scheduleRepo.create({
      title: title.trim(),
      packageId,
      fromDate,
      toDate,
      amount,
      description: description?.trim() || '',
      photos,
    });

    // Convert S3 keys to signed URLs
    const photoUrls = await Promise.all(
      created.photos.map((key) => this.s3Service.getPresignedUrl(key))
    );

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: MESSAGES.SCHEDULE_ADDED || 'Schedule added successfully',
      data: {
        ...created,
        photoUrls,
      },
    };
  }
}
