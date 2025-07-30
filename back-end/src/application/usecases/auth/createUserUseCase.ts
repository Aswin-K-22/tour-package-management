//back-end\\src\\application\\usecases\\auth\\createUserUseCase.ts'
import { User } from '@/domain/entities/user';
import { IAdminRepository } from '@/domain/repositories/admin-repository';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { IPasswordHasher } from '@/domain/services/IHashService';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';

export class CreateUserUseCase  {
  constructor(
    private adminRepository: IAdminRepository,
        private passwordHasher: IPasswordHasher,
  ) {}

  async execute(data: {
    email: string;
    password: string;
  }): Promise<IResponseDTO<User>> {
    try {
      const existingUser = await this.adminRepository.findByEmail(data.email);
      if (existingUser) {
        return {
          status: HttpStatus.CONFLICT,
          success: false,
          message: ERRORMESSAGES.USER_ALREADY_EXISTS,
        };
      }

      const hashedPassword = await this.passwordHasher.hashPassword(data.password);
      const user = await this.adminRepository.create({
        ...data,
        password: hashedPassword,
        role: 'admin',
      });

      return {
        status: HttpStatus.CREATED,
        success: true,
        message: MESSAGES.ADMIN_CREATED,
        data: user,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: ERRORMESSAGES.USER_CREATION_FAILED,
      };
    }
  }
}