import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { City } from '@/domain/entities/city';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ICityRepository } from '@/domain/repositories/city-repository';

interface CreateCityDTO {
  name: string;
  countryId: string;
}

export class CreateCityUseCase {
  constructor(private cityRepo: ICityRepository) {}

  async execute({ name, countryId }: CreateCityDTO): Promise<IResponseDTO<City>> {
    const normalizedName = name.trim().toLowerCase();

    const existing = await this.cityRepo.findByNameAndCountry(normalizedName, countryId);
    if (existing) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: ERRORMESSAGES.CITY_ALREADY_EXISTS,
      };
    }

    const data = await this.cityRepo.create({ name: normalizedName, countryId });

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: MESSAGES.CITY_ADDED,
      data,
    };
  }
}
