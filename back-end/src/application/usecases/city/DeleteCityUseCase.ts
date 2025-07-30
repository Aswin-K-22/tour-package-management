import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { ICityRepository } from '@/domain/repositories/city-repository';

export class DeleteCityUseCase {
  constructor(private cityRepo: ICityRepository) {}

  async execute(id: string): Promise<IResponseDTO<null>> {
    const existing = await this.cityRepo.findById(id);
    if (!existing) {
      return {
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: ERRORMESSAGES.CITY_NOT_FOUND,
      };
    }

    await this.cityRepo.delete(id);

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.CITY_DELETED,
      data: null,
    };
  }
}
