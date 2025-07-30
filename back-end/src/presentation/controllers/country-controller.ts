// src/interface/controllers/CountryController.ts
import { Request, Response } from 'express';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ICreateCountryUseCase } from '@/domain/usecases/country/ICreateCountryUseCase';



export class CountryController {
  constructor(private createCountryUseCase: ICreateCountryUseCase) {}


   private sendResponse<T>(res: Response, result: IResponseDTO<T>): void {
    res.status(result.status).json({
      success: result.success,
      message: result.message,
...(result.success && result.data ? { data: result.data } : {})
    });
  }

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
       const result = await this.createCountryUseCase.execute(name);
      this.sendResponse(res, result);
    } catch (error) {
     console.error('Error in CountryController.create:', error);

    this.sendResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal server error',
    });
  }
}
}