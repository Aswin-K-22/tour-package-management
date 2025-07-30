// src/application/usecases/country/DeleteCountryUseCase.ts

import { ICountryRepository } from '@/domain/repositories/country-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';

export class DeleteCountryUseCase {
  constructor(private countryRepo: ICountryRepository) {}
async execute(id: string): Promise<IResponseDTO<null>> {
  try {
    await this.countryRepo.delete(id);
    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.COUNTRY_DELETED,
      data: null,
    };
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Prisma: Record not found
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.COUNTRY_NOT_FOUND,
      };
    }

    throw error; // allow unexpected errors to bubble up
  }
}
}
