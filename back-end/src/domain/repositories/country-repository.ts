
// src/domain/repositories/country-repository.ts
import { Country } from '@/domain/entities/country';
import { IBaseRepository } from './base-repository';

export interface ICountryRepository extends IBaseRepository<Country, string> {
   getAll(page: number, limit: number): Promise<{
    countries: Country[];
    totalCount: number;
  }>;

  findByName(name: string): Promise<Country | null>;
  getAllAlphabetical(): Promise<Country[]>;


}