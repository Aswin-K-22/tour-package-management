// src/application/usecases/country/GetAllCountriesUseCase.ts

import { ICountryRepository } from '@/domain/repositories/country-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { MESSAGES } from '@/domain/constants/messages.constant';

export class GetAllCountriesUseCase  {
  constructor(private countryRepo: ICountryRepository) {}

  async execute(page: number, limit: number): Promise<IResponseDTO<any>> {
    const { countries, totalCount } = await this.countryRepo.getAll(page, limit);

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.COUNTRY_FETCHED,
      data: {
        countries,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    };
  }
}
