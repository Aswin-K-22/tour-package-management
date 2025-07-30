import { User } from '@/domain/entities/user';
import { IAdminRepository } from '@/domain/repositories/admin-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { IPasswordHasher } from '@/domain/services/IHashService';
import { MESSAGES } from '@/domain/constants/messages.constant';

export class LoginUserUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(data: {
    email: string;
    password: string;
  }): Promise<IResponseDTO<User>> {
    try {
      const user = await this.adminRepository.findByEmail(data.email);
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          success: false,
          message: ERRORMESSAGES.USER_NOT_FOUND,
        };
      }

      if (user.role !== 'admin') {
        return {
          status: HttpStatus.FORBIDDEN,
          success: false,
          message: ERRORMESSAGES.ADMIN_INVALID_ROLE,
        };
      }


      const isPasswordValid = await this.passwordHasher.comparePasswords(
        data.password,
        user.password
      );
      if (!isPasswordValid || user.role != 'admin') {
        return {
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          message: ERRORMESSAGES.INVALID_CREDENTIALS,
        };
      }

      return {
        status: HttpStatus.OK,
        success: true,
        message: MESSAGES.LOGIN_SUCCESSFUL,
        data: user,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: ERRORMESSAGES.LOGIN_FAILED,
      };
    }
  }
}