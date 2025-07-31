import { Package } from '@/domain/entities/package';
import { IPackageRepository } from '@/domain/repositories/package-repository';
import { S3Service } from '@/infrastructure/services/S3Service';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { MESSAGES } from '@/domain/constants/messages.constant';

export class DeletePackageUseCase {
  constructor(
    private packageRepo: IPackageRepository,
    private s3Service: S3Service
  ) {}

  async execute(packageId: string): Promise<IResponseDTO<null>> {
    const existing = await this.packageRepo.findById(packageId);
    if (!existing) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.PACKAGE_NOT_FOUND,
      };
    }

    // Delete associated images from S3
    for (const key of existing.photos) {
      try {
        await this.s3Service.deleteFile(key);
      } catch (err) {
        console.warn(`Failed to delete image ${key}, skipping`);
      }
    }

    // Delete package from DB
    await this.packageRepo.delete(packageId);

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.PACKAGE_DELETED,
      data: null,
    };
  }
}
