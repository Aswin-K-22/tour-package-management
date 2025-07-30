// src/domain/usecases/country/ICreateCountryUseCase.ts

import { IResponseDTO } from "@/domain/dtos/response.dto";
import { Country } from "@/domain/entities/country";

export interface ICreateCountryUseCase {
  execute(name: string): Promise<IResponseDTO<Country>>;
}
