import { MESSAGES } from '@/domain/constants/messages.constant';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';
import { IEnquiryRepository } from '@/domain/repositories/enquiry-repository';
import { IPackageRepository } from '@/domain/repositories/package-repository';
import { IScheduleRepository } from '@/domain/repositories/schedule-repository';

interface EnquiryResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  package: {
    id: string;
    title: string;
  };
  schedule?: {
    id: string;
    title: string;
  } | null;
}
export interface IPaginatedResponseDTO<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  meta: {
    totalEnquiries: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}



export class GetAllEnquiriesUseCase {
  constructor(
    private enquiryRepository: IEnquiryRepository,
    private packageRepository: IPackageRepository,
    private scheduleRepository: IScheduleRepository
  ) {}

  async execute(page: number, limit: number): Promise<IPaginatedResponseDTO<EnquiryResponseDTO[]>> {
    const enquiries = await this.enquiryRepository.findAllPaginated(page, limit);
    const totalEnquiries = await this.enquiryRepository.countAll();
    const totalPages = Math.ceil(totalEnquiries / limit);

    const enriched = await Promise.all(enquiries.map(async (enquiry) => {
      const pkg = enquiry.packageId
        ? await this.packageRepository.findById(enquiry.packageId)
        : null;

      const schedule = enquiry.scheduleId
        ? await this.scheduleRepository.findById(enquiry.scheduleId)
        : null;

      return {
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
        createdAt: enquiry.createdAt,
        updatedAt: enquiry.updatedAt,
        package: {
          id: pkg?.id ?? enquiry.packageId ?? 'unknown',
          title: pkg?.title ?? 'Unknown Package',
        },
        schedule: schedule
          ? {
              id: schedule.id,
              title: schedule.title,
            }
          : null,
      };
    }));

    return {
      success: true,
      status: HttpStatus.OK,
      message: MESSAGES.ENQUIRIES_FETCHED,
      data: enriched,
      meta: {
        totalEnquiries,
        totalPages,
        currentPage: page,
        limit
      }
    };
  }
}

