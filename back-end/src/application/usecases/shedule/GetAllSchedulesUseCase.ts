import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { IScheduleRepository } from '@/domain/repositories/schedule-repository';
import { IPackageRepository } from '@/domain/repositories/package-repository';
import { S3Service } from '@/infrastructure/services/S3Service';

interface GetAllSchedulesDTO {
  page: number;
  limit: number;
}

export class GetAllSchedulesUseCase {
  private s3Service: S3Service;

  constructor(
    private scheduleRepo: IScheduleRepository,
    private packageRepo: IPackageRepository
  ) {
    this.s3Service = new S3Service();
  }

  async execute({ page, limit }: GetAllSchedulesDTO): Promise<IResponseDTO<{
    schedules: any[];
    totalCount: number;
    totalPages: number;
  }>> {
    const allSchedules = await this.scheduleRepo.findAll();
    const totalCount = allSchedules.length;
    const totalPages = Math.ceil(totalCount / limit);
    const start = (page - 1) * limit;
    const paginated = allSchedules.slice(start, start + limit);

    const enriched = await Promise.all(
      paginated.map(async (schedule) => {
        const photoUrls = await Promise.all(
          schedule.photos.map(key => this.s3Service.getPresignedUrl(key))
        );

        // ✅ Fetch the package details using packageId
        const packageDetails = await this.packageRepo.findById(schedule.packageId);

        return {
          ...schedule,
          photoUrls,
          package: packageDetails || null, // fallback in case not found
        };
      })
    );

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Schedules fetched successfully',
      data: {
        schedules: enriched,
        totalCount,
        totalPages,
      },
    };
  }
}
