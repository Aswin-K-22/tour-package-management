// src/application/usecases/country/UpdateCountryUseCase.ts

import { ICountryRepository } from '@/domain/repositories/country-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { Country } from '@/domain/entities/country';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';

export class UpdateCountryUseCase {
  constructor(private countryRepo: ICountryRepository) {}

  async execute(id: string, name: string): Promise<IResponseDTO<Country>> {
     const existing = await this.countryRepo.findByName(name);
    if (existing) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: ERRORMESSAGES.COUNTRY_ALREADY_EXISTS,
      };
    }
    const updated = await this.countryRepo.update(id, { name });

    if (!updated) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.COUNTRY_NOT_FOUND,
      };
    }

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.COUNTRY_UPDATED,
      data: updated,
    };
  }
}
