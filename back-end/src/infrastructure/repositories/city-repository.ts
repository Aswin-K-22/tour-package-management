import { PrismaClient } from '@prisma/client';
import { City } from '@/domain/entities/city';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { ICityRepository } from '@/domain/repositories/city-repository';

export class CityRepository extends BaseRepository<City, string> implements ICityRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'city');
  }

  async findByCountryId(countryId: string): Promise<City[]> {
    return this.prisma.city.findMany({
      where: { countryId },
    });
  }
}