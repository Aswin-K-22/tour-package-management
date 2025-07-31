import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { Package } from '@/domain/entities/package';
import { IPackageRepository } from '@/domain/repositories/package-repository';
import { S3Service } from '@/infrastructure/services/S3Service';
import { CreatePackageDTO } from '@/domain/dtos/createPackageDTO';

export class CreatePackageUseCase {
  private s3Service: S3Service;

  constructor(private packageRepo: IPackageRepository) {
    this.s3Service = new S3Service();
  }

  async execute(data: CreatePackageDTO): Promise<IResponseDTO<Package & { photoUrls: string[] }>> {
    const {
      title,
      description,
      terms,
      source,
      destination,
      imageKeys,
    } = data;

    // Optional: enforce uniqueness of package title
    // const existing = await this.packageRepo.findByTitle(title.trim());
    // if (existing) {
    //   return {
    //     success: false,
    //     status: HttpStatus.BAD_REQUEST,
    //     message: ERRORMESSAGES.PACKAGE_ALREADY_EXISTS,
    //   };
    // }

    const created = await this.packageRepo.create({
      title: title.trim(),
      description,
      terms,
      sourceCountryId: source.country,
      sourceCityId: source.city,
      destinationCountryId: destination.country,
      destinationCityId: destination.city,
      photos: imageKeys,
    });

    const photoUrls = await Promise.all(
      created.photos.map((key) => this.s3Service.getPresignedUrl(key))
    );

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: MESSAGES.PACKAGE_ADDED,
      data: {
        ...created,
        photoUrls,
      },
    };
  }
}
