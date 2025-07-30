// src/application/usecases/country/GetAllCountriesAlphabeticalUseCase.ts
import { ICountryRepository } from '@/domain/repositories/country-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { Country } from '@/domain/entities/country';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';

export class GetAllCountriesAlphabeticalUseCase {
  constructor(private countryRepo: ICountryRepository) {}

  async execute(): Promise<IResponseDTO<Country[]>> {
    const countries = await this.countryRepo.getAllAlphabetical();
    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.COUNTRY_FETCHED,
      data: countries,
    };
  }
}
