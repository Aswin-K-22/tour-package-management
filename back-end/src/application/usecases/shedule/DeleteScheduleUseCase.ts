import { IScheduleRepository } from '@/domain/repositories/schedule-repository';
import { S3Service } from '@/infrastructure/services/S3Service';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { MESSAGES } from '@/domain/constants/messages.constant';

export class DeleteScheduleUseCase {
  constructor(
    private scheduleRepo: IScheduleRepository,
    private s3Service: S3Service
  ) {}

  async execute(scheduleId: string): Promise<IResponseDTO<null>> {
    const existing = await this.scheduleRepo.findById(scheduleId);
    if (!existing) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.SCHEDULE_NOT_FOUND || 'Schedule not found',
      };
    }

    for (const key of existing.photos) {
      try {
        await this.s3Service.deleteFile(key);
      } catch (err) {
        console.warn(`Failed to delete photo ${key}, skipping`);
      }
    }

    await this.scheduleRepo.delete(scheduleId);

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.SCHEDULE_DELETED || 'Schedule deleted successfully',
      data: null,
    };
  }
}
