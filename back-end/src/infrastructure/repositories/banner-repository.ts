import { PrismaClient } from '@prisma/client';
import { Banner } from '@/domain/entities/banner';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { IBannerRepository } from '@/domain/repositories/banner-repository';

export class BannerRepository extends BaseRepository<Banner, string> implements IBannerRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'banner');
  }
}