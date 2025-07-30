import { Enquiry } from "../entities/enquiry";
import { IBaseRepository } from "./base-repository";


export interface IEnquiryRepository extends IBaseRepository<Enquiry, string> {
  //findByPackageId(packageId: string): Promise<Enquiry[]>;
  //findByScheduleId(scheduleId: string): Promise<Enquiry[]>;
}