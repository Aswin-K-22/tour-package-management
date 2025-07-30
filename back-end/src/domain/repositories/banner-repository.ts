import { Banner } from "../entities/banner";
import { IBaseRepository } from "./base-repository";


export interface IBannerRepository extends IBaseRepository<Banner, string> {
  // Add any banner-specific methods here if needed
}