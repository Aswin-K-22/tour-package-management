import { Request, Response } from 'express';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { CreateCityUseCase } from '@/application/usecases/city/CreateCityUseCase';
import { GetAllCitiesUseCase } from '@/application/usecases/city/GetAllCitiesUseCase';
import { UpdateCityUseCase } from '@/application/usecases/city/UpdateCityUseCase';
import { DeleteCityUseCase } from '@/application/usecases/city/DeleteCityUseCase';
import { GetAllCitiesAlphabeticalUseCase } from '@/application/usecases/city/GetAllCitiesAlphabeticalUseCase';
import { GetCitiesByCountryIdUseCase } from '@/application/usecases/city/GetCitiesByCountryIdUseCase';


export class CityController {
  constructor(
    private createCityUseCase: CreateCityUseCase,
    private getAllCitiesUseCase: GetAllCitiesUseCase,
    private updateCityUseCase: UpdateCityUseCase,
    private deleteCityUseCase: DeleteCityUseCase,
    private getAllCitiesAlphabeticalUseCase: GetAllCitiesAlphabeticalUseCase,
    private getCitiesByCountryIdUseCase :GetCitiesByCountryIdUseCase
  ) {}

  private sendResponse<T>(res: Response, result: IResponseDTO<T>): void {
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      ...(result.success && result.data ? { data: result.data } : {}),
    });
  }

  async create(req: Request, res: Response) {
    try {
      const { name, countryId } = req.body;
      const result = await this.createCityUseCase.execute({ name, countryId });
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CityController.create:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.getAllCitiesUseCase.execute({ page, limit });
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CityController.getAll:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getAllAlpha(req: Request, res: Response) {
    try {
      const result = await this.getAllCitiesAlphabeticalUseCase.execute();
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CityController.getAllAlpha:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { name, countryId } = req.body;
      const result = await this.updateCityUseCase.execute({ id, name, countryId });
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CityController.update:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.deleteCityUseCase.execute(id);
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in CityController.delete:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }
  async getByCountryId(req: Request, res: Response) {
  try {
    const countryId = req.params.countryId;
    const result = await this.getCitiesByCountryIdUseCase.execute(countryId);
    this.sendResponse(res, result);
  } catch (error) {
    console.error('Error in CityController.getByCountryId:', error);
    this.sendResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal server error',
    });
  }
}


}
