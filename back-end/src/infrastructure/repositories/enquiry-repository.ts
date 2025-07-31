import { PrismaClient } from '@prisma/client';
import { Enquiry } from '@/domain/entities/enquiry';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { IEnquiryRepository } from '@/domain/repositories/enquiry-repository';

export class EnquiryRepository extends BaseRepository<Enquiry, string> implements IEnquiryRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'enquiry');
  }



  async countAll(): Promise<number> {
    return this.prisma.enquiry.count(); 
  }
  

  async findAllPaginated(page: number, limit: number): Promise<Enquiry[]> {
    const skip = (page - 1) * limit;

    const enquiries = await this.prisma.enquiry.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, 
    });

    return enquiries;
  }

}