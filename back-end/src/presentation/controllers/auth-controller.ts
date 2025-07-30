import { Request, Response } from 'express';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { CreateUserUseCase } from '@/application/usecases/auth/createUserUseCase';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { LoginUserUseCase } from '@/application/usecases/auth/loginUserUseCase';
import { ITokenService } from '@/domain/services/ITokenService';
import { MESSAGES } from '@/domain/constants/messages.constant';
import { GetUserUseCase } from '@/application/usecases/auth/getUserUseCase';
//import { ILoginUserUseCase } from '@/domain/usecases/auth/ILoginUserUseCase';
//import { ILogoutUserUseCase } from '@/domain/usecases/auth/ILogoutUserUseCase';
//import { IGetUserUseCase } from '@/domain/usecases/auth/IGetUserUseCase';

export class AuthController  {
  constructor(
    private createUserUseCase: CreateUserUseCase,
     private loginUserUseCase: LoginUserUseCase,
      private tokenService: ITokenService,
    private getUserUseCase: GetUserUseCase
  ) {}

  private sendResponse<T>(res: Response, result: IResponseDTO<T>): void {
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      ...(result.success && result.data ? { data: result.data } : {}),
    });
  }
  private async setAuthCookies(res: Response, user: { email: string; id: string }): Promise<void> {
    const accessToken = await this.tokenService.generateAccessToken({ email: user.email, id: user.id });
    const refreshToken = await this.tokenService.generateRefreshToken({ email: user.email, id: user.id });

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  }


  async create(req: Request, res: Response): Promise<void> {
    try {
      const {  email, password } = req.body;
      const result = await this.createUserUseCase.execute({  email, password });

        if (result.success && result.data) {
        await this.setAuthCookies(res, { email: result.data.email, id: result.data.id });
      }
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in AuthController.create:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: ERRORMESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

 async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute({ email, password });
       if (result.success && result.data) {
        await this.setAuthCookies(res, { email: result.data.email, id: result.data.id });
      }

      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in AuthController.login:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: ERRORMESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

 async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('accessToken', { httpOnly: true, secure: true });
      res.clearCookie('refreshToken', { httpOnly: true, secure: true });
        this.sendResponse(res, {
        status: HttpStatus.OK,
        success: true,
        message: MESSAGES.LOGOUT,
      });
    } catch (error) {
      console.error('Error in AuthController.logout:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: ERRORMESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body?.admin;
      const result = await this.getUserUseCase.execute(id);
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in AuthController.get:', error);
     this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: ERRORMESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}