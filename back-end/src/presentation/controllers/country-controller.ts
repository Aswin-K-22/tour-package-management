// src/interface/controllers/CountryController.ts
import { Request, Response } from 'express';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { ICreateCountryUseCase } from '@/domain/usecases/country/ICreateCountryUseCase';
import { GetAllCountriesUseCase } from '@/application/usecases/country/GetAllCountriesUseCase';
import { UpdateCountryUseCase } from '@/application/usecases/country/UpdateCountryUseCase';
import { DeleteCountryUseCase } from '@/application/usecases/country/DeleteCountryUseCase';
import { GetAllCountriesAlphabeticalUseCase } from '@/application/usecases/country/GetAllCountriesAlphabeticalUseCase';



export class CountryController {
  constructor(
    private createCountryUseCase: ICreateCountryUseCase,
  private getAllCountriesUseCase: GetAllCountriesUseCase,
    private updateCountryUseCase: UpdateCountryUseCase,
    private deleteCountryUseCase: DeleteCountryUseCase,
    private getAllCountriesAlphabeticalUseCase : GetAllCountriesAlphabeticalUseCase,
  ) {}


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


async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 3 } = req.query;
      const result = await this.getAllCountriesUseCase.execute(Number(page), Number(limit));
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CountryController.getAll:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const result = await this.updateCountryUseCase.execute(id, name);
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CountryController.update:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.deleteCountryUseCase.execute(id);
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CountryController.delete:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }


  async getAllAlpha(req: Request, res: Response) {
  try {
    const result = await this.getAllCountriesAlphabeticalUseCase.execute();
    this.sendResponse(res, result);
  } catch (error) {
    console.error('Error in CountryController.getAllAlpha:', error);
    this.sendResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal server error',
    });
  }
}

}