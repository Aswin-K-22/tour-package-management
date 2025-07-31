import { IResponseDTO } from "@/domain/dtos/response.dto";
import { HttpStatus } from "@/domain/enums/httpStatus.enum";
import { ICityRepository } from "@/domain/repositories/city-repository";
import { ICountryRepository } from "@/domain/repositories/country-repository";
import { IPackageRepository } from "@/domain/repositories/package-repository";
import { IScheduleRepository } from "@/domain/repositories/schedule-repository";
import { S3Service } from "@/infrastructure/services/S3Service";

export class GetPackageByIdUseCase {
  private s3Service: S3Service;

  constructor(
    private packageRepo: IPackageRepository,
    private cityRepo: ICityRepository,
    private countryRepo: ICountryRepository,
    private scheduleRepo: IScheduleRepository
  ) {
    this.s3Service = new S3Service();
  }

  async execute(packageId: string): Promise<IResponseDTO<any>> {
    const pkg = await this.packageRepo.findById(packageId);
    if (!pkg) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: "Package not found",
      };
    }

    const [
      sourceCity,
      destinationCity,
      sourceCountry,
      destinationCountry
    ] = await Promise.all([
      this.cityRepo.findById(pkg.sourceCityId),
      this.cityRepo.findById(pkg.destinationCityId),
      this.countryRepo.findById(pkg.sourceCountryId),
      this.countryRepo.findById(pkg.destinationCountryId),
    ]);

    const photoUrls = await Promise.all(
      pkg.photos.map((key) => this.s3Service.getPresignedUrl(key))
    );

    const schedules = await this.scheduleRepo.findByPackageId(pkg.id);

    const enrichedSchedules = await Promise.all(
      schedules.map(async (schedule) => {
        const schedulePhotoUrls = await Promise.all(
          schedule.photos.map((key) => this.s3Service.getPresignedUrl(key))
        );

        return {
          id: schedule.id,
          title: schedule.title,
          fromDate: schedule.fromDate,
          toDate: schedule.toDate,
          amount: schedule.amount,
          description: schedule.description,
          photoUrls: schedulePhotoUrls,
        };
      })
    );

    return {
      success: true,
      status: HttpStatus.OK,
      message: "Package fetched successfully",
      data: {
        id: pkg.id,
        title: pkg.title,
        description: pkg.description,
        terms: pkg.terms,
        photoUrls,
        sourceCityName: sourceCity?.name || "Unknown City",
        destinationCityName: destinationCity?.name || "Unknown City",
        sourceCountryName: sourceCountry?.name || "Unknown Country",
        destinationCountryName: destinationCountry?.name || "Unknown Country",
        schedules: enrichedSchedules,
      },
    };
  }
}
