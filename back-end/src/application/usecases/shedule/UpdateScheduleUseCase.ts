import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { IScheduleRepository } from '@/domain/repositories/schedule-repository';
import { Schedule } from '@/domain/entities/schedule';
import { S3Service } from '@/infrastructure/services/S3Service';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';

export class UpdateScheduleUseCase {
  constructor(
    private scheduleRepo: IScheduleRepository,
    private s3Service: S3Service
  ) {}

  async execute(data: {
    scheduleId: string;
    title: string;
    packageId: string;
    fromDate: Date;
    toDate: Date;
    amount: number;
    description?: string;
    newPhotos: string[];
    deletePhotoKeys?: string[];
  }): Promise<IResponseDTO<Schedule & { photoUrls: string[] }>> {
    const {
      scheduleId,
      title,
      packageId,
      fromDate,
      toDate,
      amount,
      description,
      newPhotos,
      deletePhotoKeys = [],
    } = data;

    const existing = await this.scheduleRepo.findById(scheduleId);
    if (!existing) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.SCHEDULE_NOT_FOUND || 'Schedule not found',
      };
    }

    for (const key of deletePhotoKeys) {
      await this.s3Service.deleteFile(key);
    }

    const updatedPhotos = existing.photos
      .filter(key => !deletePhotoKeys.includes(key))
      .concat(newPhotos);

    const updated = await this.scheduleRepo.update(scheduleId, {
      title: title.trim(),
      packageId,
      fromDate,
      toDate,
      amount,
      description: description?.trim() || '',
      photos: updatedPhotos,
    });

    const photoUrls = await Promise.all(
      updated.photos.map(key => this.s3Service.getPresignedUrl(key))
    );

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.SCHEDULE_UPDATED || 'Schedule updated successfully',
      data: {
        ...updated,
        photoUrls,
      },
    };
  }
}
