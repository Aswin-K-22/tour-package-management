import { IResponseDTO } from '@/domain/dtos/response.dto';
import { City } from '@/domain/entities/city';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ICityRepository } from '@/domain/repositories/city-repository';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';

export class GetCitiesByCountryIdUseCase {
  constructor(private cityRepo: ICityRepository) {}

  async execute(countryId: string): Promise<IResponseDTO<City[]>> {
    const cities = await this.cityRepo.findByCountryId(countryId);

    if (!cities || cities.length === 0) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.NO_CITIES_FOUND_FOR_COUNTRY,
      };
    }

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Cities retrieved successfully',
      data: cities,
    };
  }
}
