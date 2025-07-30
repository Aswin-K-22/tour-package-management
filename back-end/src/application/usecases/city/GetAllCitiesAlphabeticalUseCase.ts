import { IResponseDTO } from '@/domain/dtos/response.dto';
import { City } from '@/domain/entities/city';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ICityRepository } from '@/domain/repositories/city-repository';

export class GetAllCitiesAlphabeticalUseCase {
  constructor(private cityRepo: ICityRepository) {}

  async execute(): Promise<IResponseDTO<City[]>> {
    const cities = await this.cityRepo.findAllAlphabetical();
    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Cities (A–Z) fetched successfully',
      data: cities,
    };
  }
}
