import { PrismaClient } from '@prisma/client';
import { Enquiry } from '@/domain/entities/enquiry';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { IEnquiryRepository } from '@/domain/repositories/enquiry-repository';

export class EnquiryRepository extends BaseRepository<Enquiry, string> implements IEnquiryRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'enquiry');
  }




}