import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { Package } from '@/domain/entities/package';
import { IPackageRepository } from '@/domain/repositories/package-repository';
import { S3Service } from '@/infrastructure/services/S3Service';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';


export class UpdatePackageUseCase {
  constructor(
    private packageRepo: IPackageRepository,
    private s3Service: S3Service
  ) {}

  async execute(data: {
    packageId: string;
    title: string;
    description: string;
    terms: string[];
    source: { country: string; city: string };
    destination: { country: string; city: string };
    imageKeys: string[];
    deleteImageKeys?: string[];
  }): Promise<IResponseDTO<Package & { photoUrls: string[] }>> {
    const {
      packageId,
      title,
      description,
      terms,
      source,
      destination,
      imageKeys,
      deleteImageKeys = [],
    } = data;

    const existing = await this.packageRepo.findById(packageId);
    if (!existing) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.PACKAGE_NOT_FOUND,
      };
    }

    // Delete specified images from S3
    for (const key of deleteImageKeys) {
      await this.s3Service.deleteFile(key);
    }

    // Remove deleted keys from existing images
    const updatedImageKeys = existing.photos
      .filter(key => !deleteImageKeys.includes(key))
      .concat(imageKeys); // Add new ones

    const updated = await this.packageRepo.update(packageId, {
      title: title.trim(),
      description,
      terms,
      sourceCountryId: source.country,
      sourceCityId: source.city,
      destinationCountryId: destination.country,
      destinationCityId: destination.city,
      photos: updatedImageKeys,
    });

    const photoUrls = await Promise.all(
      updated.photos.map((key) => this.s3Service.getPresignedUrl(key))
    );

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.PACKAGE_UPDATED,
      data: {
        ...updated,
        photoUrls,
      },
    };
  }
}

