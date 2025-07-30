import { IResponseDTO } from '@/domain/dtos/response.dto';
import { City } from '@/domain/entities/city';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { ICityRepository } from '@/domain/repositories/city-repository';

interface UpdateCityDTO {
  id: string;
  name: string;
  countryId: string;
}

export class UpdateCityUseCase {
  constructor(private cityRepo: ICityRepository) {}

  async execute({ id, name, countryId }: UpdateCityDTO): Promise<IResponseDTO<City>> {
    const normalizedName = name.trim().toLowerCase();

    const existingCity = await this.cityRepo.findByNameAndCountry(normalizedName, countryId);
    if (existingCity && existingCity.id !== id) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: ERRORMESSAGES.CITY_ALREADY_EXISTS,
      };
    }

    const existing = await this.cityRepo.findById(id);
    if (!existing) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.CITY_NOT_FOUND,
      };
    }

    const updated = await this.cityRepo.update(id, { name: normalizedName, countryId });

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.CITY_UPDATED,
      data: updated,
    };
  }
}
