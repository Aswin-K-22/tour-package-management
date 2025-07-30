// src/application/usecases/country/DeleteCountryUseCase.ts

import { ICountryRepository } from '@/domain/repositories/country-repository';
import { ICityRepository } from '@/domain/repositories/city-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';

export class DeleteCountryUseCase {
  constructor(
    private countryRepo: ICountryRepository,
    private cityRepo: ICityRepository // 🆕 Inject cityRepo
  ) {}

  async execute(id: string): Promise<IResponseDTO<null>> {
    try {
      // 🧠 Step 1: Check if any cities are linked to this country
      const cities = await this.cityRepo.findByCountryId(id);
      if (cities.length > 0) {
        return {
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: ERRORMESSAGES.COUNTRY_HAS_CITIES, // e.g. "Cannot delete country with associated cities"
        };
      }

      // ✅ Step 2: Safe to delete
      await this.countryRepo.delete(id);

      return {
        success: true,
        status: HttpStatus.OK,
        message: MESSAGES.COUNTRY_DELETED,
        data: null,
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: ERRORMESSAGES.COUNTRY_NOT_FOUND,
        };
      }

      throw error;
    }
  }
}
