import { User } from '@/domain/entities/user';
import { IAdminRepository } from '@/domain/repositories/admin-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { MESSAGES } from '@/domain/constants/messages.constant';

export class GetUserUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(userId: string): Promise<IResponseDTO<User>> {
    try {
      const user = await this.adminRepository.findById(userId);
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          success: false,
          message: ERRORMESSAGES.USER_NOT_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        success: true,
        message: MESSAGES.USER_RETRIEVED,
        data: user,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: ERRORMESSAGES.INTERNAL_SERVER_ERROR,
      };
    }
  }
}