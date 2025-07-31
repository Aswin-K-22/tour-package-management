import { IResponseDTO } from "@/domain/dtos/response.dto";
import { HttpStatus } from "@/domain/enums/httpStatus.enum";
import { ICityRepository } from "@/domain/repositories/city-repository";
import { ICountryRepository } from "@/domain/repositories/country-repository";
import { IPackageRepository } from "@/domain/repositories/package-repository";
import { S3Service } from "@/infrastructure/services/S3Service";

interface GetAllPackagesDTO {
  page: number;
  limit: number;
}

export class GetAllPackagesUseCase {
  private s3Service: S3Service;

  constructor(
    private packageRepo: IPackageRepository,
    private cityRepo: ICityRepository,
    private countryRepo: ICountryRepository
  ) {
    this.s3Service = new S3Service();
  }

  async execute({ page, limit }: GetAllPackagesDTO): Promise<IResponseDTO<{
    packages: any[]; // Include enriched fields
    totalCount: number;
    totalPages: number;
  }>> {
    const all = await this.packageRepo.findAll();
    const totalCount = all.length;
    const totalPages = Math.ceil(totalCount / limit);
    const start = (page - 1) * limit;
    const paginated = all.slice(start, start + limit);

    const packagesWithExtras = await Promise.all(
      paginated.map(async (pkg) => {
        const photoUrls = await Promise.all(
          pkg.photos.map((key) => this.s3Service.getPresignedUrl(key))
        );

        // Fetch city and country names
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
      message: 'Packages fetched successfully',
      data: {
        packages: packagesWithExtras,
        totalCount,
        totalPages,
      },
    };
  }
}
