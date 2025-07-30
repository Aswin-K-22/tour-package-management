import { Country } from '@/domain/entities/country';
import { IBaseRepository } from './base-repository';

export interface ICountryRepository extends IBaseRepository<Country, string> {
  // Add any country-specific methods here if needed
}