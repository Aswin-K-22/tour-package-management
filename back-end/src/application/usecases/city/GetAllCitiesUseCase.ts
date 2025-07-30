import { CityWithCountryDTO } from '@/domain/dtos/city-with-country.dto';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { City } from '@/domain/entities/city';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ICityRepository } from '@/domain/repositories/city-repository';

interface GetAllCitiesDTO {
  page: number;
  limit: number;
}

export class GetAllCitiesUseCase {
  constructor(private cityRepo: ICityRepository) {}

  async execute({
    page,
    limit,
  }: GetAllCitiesDTO): Promise<IResponseDTO<{ cities: CityWithCountryDTO[]; totalCount: number; totalPages: number }>> {
    const { cities, totalCount } = await this.cityRepo.findAllWithPagination({ page, limit });

    // ✅ Inline type to tell TypeScript that each city has a related `country` with `name`
    type CityWithCountryRelation = City & {
      country: {
        name: string;
      };
    };

    const formattedCities: CityWithCountryDTO[] = (cities as CityWithCountryRelation[]).map(city => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId,
      countryName: city.country?.name || '',
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    }));

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Cities fetched successfully',
      data: {
        cities: formattedCities,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
