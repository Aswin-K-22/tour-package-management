import { City } from "../entities/city";
import { IBaseRepository } from "./base-repository";

export interface ICityRepository extends IBaseRepository<City, string> {
  findByCountryId(countryId: string): Promise<City[]>;
}