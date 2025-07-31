import { IResponseDTO } from "@/domain/dtos/response.dto";
import { HttpStatus } from "@/domain/enums/httpStatus.enum";
import { ICityRepository } from "@/domain/repositories/city-repository";
import { ICountryRepository } from "@/domain/repositories/country-repository";
import { IPackageRepository } from "@/domain/repositories/package-repository";
import { S3Service } from "@/infrastructure/services/S3Service";

export class GetAllPackagesFullUseCase {
  private s3Service: S3Service;

  constructor(
    private packageRepo: IPackageRepository,
    private cityRepo: ICityRepository,
    private countryRepo: ICountryRepository
  ) {
    this.s3Service = new S3Service();
  }

  async execute(): Promise<IResponseDTO<{ packages: any[] }>> {
    const all = await this.packageRepo.findAll();

    const packagesWithExtras = await Promise.all(
      all.map(async (pkg) => {
        const photoUrls = await Promise.all(
          pkg.photos.map((key) => this.s3Service.getPresignedUrl(key))
        );

        const [
          sourceCity,
          destinationCity,
          sourceCountry,
          destinationCountry,
        ] = await Promise.all([
          this.cityRepo.findById(pkg.sourceCityId),
          this.cityRepo.findById(pkg.destinationCityId),
          this.countryRepo.findById(pkg.sourceCountryId),
          this.countryRepo.findById(pkg.destinationCountryId),
        ]);

        return {
          ...pkg,
          photoUrls,
          sourceCityName: sourceCity?.name || "Unknown City",
          destinationCityName: destinationCity?.name || "Unknown City",
          sourceCountryName: sourceCountry?.name || "Unknown Country",
          destinationCountryName: destinationCountry?.name || "Unknown Country",
        };
      })
    );

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'All packages fetched successfully',
      data: {
        packages: packagesWithExtras,
      },
    };
  }
}
