import { IResponseDTO } from "../dtos/response.dto";
import { Enquiry } from "../entities/enquiry";
import { IBaseRepository } from "./base-repository";


export interface IEnquiryRepository extends IBaseRepository<Enquiry, string> {
     findAllPaginated(page: number, limit: number): Promise<Enquiry[]>;
     countAll(): Promise<number>;

   
  //findByPackageId(packageId: string): Promise<Enquiry[]>;
  //findByScheduleId(scheduleId: string): Promise<Enquiry[]>;
}