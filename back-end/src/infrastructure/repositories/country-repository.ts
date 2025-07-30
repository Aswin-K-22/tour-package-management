import { PrismaClient } from '@prisma/client';
import { Country } from '@/domain/entities/country';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { ICountryRepository } from '@/domain/repositories/country-repository';

export class CountryRepository extends BaseRepository<Country, string> implements ICountryRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'country');
  }
}