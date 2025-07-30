import { PrismaClient } from '@prisma/client';
import { Package } from '@/domain/entities/package';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { IPackageRepository } from '@/domain/repositories/package-repository';

export class PackageRepository extends BaseRepository<Package, string> implements IPackageRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'package');
  }
}