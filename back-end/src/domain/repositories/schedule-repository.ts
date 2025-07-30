import { Schedule } from "../entities/schedule";
import { IBaseRepository } from "./base-repository";


export interface IScheduleRepository extends IBaseRepository<Schedule, string> {
  findByPackageId(packageId: string): Promise<Schedule[]>;
}