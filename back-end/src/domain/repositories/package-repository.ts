import { Package } from "../entities/package";
import { IBaseRepository } from "./base-repository";


export interface IPackageRepository extends IBaseRepository<Package, string> {
  // Add any package-specific methods here if needed
}