import { City } from '@/domain/entities/city';
import { IBaseRepository } from './base-repository';

export interface ICityRepository extends IBaseRepository<City, string> {
  findByCountryId(countryId: string): Promise<City[]>;
  findByNameAndCountry(name: string, countryId: string): Promise<City | null>;
  findAllWithPagination(params: { page: number; limit: number }): Promise<{ cities: City[]; totalCount: number }>;
  findAllAlphabetical(): Promise<City[]>;
}
