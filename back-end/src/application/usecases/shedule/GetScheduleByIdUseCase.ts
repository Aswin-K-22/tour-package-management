import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { IScheduleRepository } from '@/domain/repositories/schedule-repository';
import { IPackageRepository } from '@/domain/repositories/package-repository';
import { S3Service } from '@/infrastructure/services/S3Service';

export class GetScheduleByIdUseCase {
  private s3Service: S3Service;

  constructor(
    private scheduleRepo: IScheduleRepository,
    private packageRepo: IPackageRepository
  ) {
    this.s3Service = new S3Service();
  }

  async execute(id: string): Promise<IResponseDTO<any>> {
    const schedule = await this.scheduleRepo.findById(id);

    if (!schedule) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: 'Schedule not found',
        data: null,
      };
    }

    const photoUrls = await Promise.all(
      schedule.photos.map((key: string) => this.s3Service.getPresignedUrl(key))
    );

    const packageDetails = await this.packageRepo.findById(schedule.packageId);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Schedule fetched successfully',
      data: {
        ...schedule,
        photoUrls,
        package: packageDetails || null,
      },
    };
  }
}
