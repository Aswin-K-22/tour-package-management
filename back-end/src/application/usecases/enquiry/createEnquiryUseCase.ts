import { MESSAGES } from '@/domain/constants/messages.constant';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { Enquiry } from '@/domain/entities/enquiry';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { IEnquiryRepository } from '@/domain/repositories/enquiry-repository';

interface ICreateEnquiryDTO {
  name: string;
  email: string;
  phone: string;
  message: string;
  package: string;
  schedule?: string;
}


export class CreateEnquiryUseCase {
  constructor(private enquiryRepository: IEnquiryRepository) {}

  async execute(data: ICreateEnquiryDTO): Promise<IResponseDTO<Enquiry>> {
    
    const enquiry = await this.enquiryRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      packageId: data.package,
      scheduleId: data.schedule, // ✅ optional
    });

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: MESSAGES.ENQUIRY_CREATED,
      data: enquiry,
    };
  }
}
