// src/application/usecases/country/CreateCountryUseCase.ts

import { MESSAGES } from '@/domain/constants/messages.constant';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { Country } from '@/domain/entities/country';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ICountryRepository } from '@/domain/repositories/country-repository';
import { ICreateCountryUseCase } from '@/domain/usecases/country/ICreateCountryUseCase';

export class CreateCountryUseCase implements ICreateCountryUseCase {
  constructor(private countryRepo: ICountryRepository) {}

  async execute(name: string) : Promise<IResponseDTO<Country>> {
  
    const data = await this.countryRepo.create({ name });
    return {
        success: true,
          status: HttpStatus.CREATED,
          message:MESSAGES.COUNTRY_ADDED ,
          data 
  }
}
}
