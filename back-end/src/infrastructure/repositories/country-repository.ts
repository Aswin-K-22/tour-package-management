import { PrismaClient } from '@prisma/client';
import { Country } from '@/domain/entities/country';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { ICountryRepository } from '@/domain/repositories/country-repository';

export class CountryRepository extends BaseRepository<Country, string> implements ICountryRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'country');
  }


async getAll(page: number, limit: number): Promise<{
    countries: Country[];
    totalCount: number;
  }> {
    const skip = (page - 1) * limit;

    const [rows, totalCount] = await Promise.all([
      this.prisma.country.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.country.count(),
    ]);

    const countries: Country[] = rows.map((row) => ({
      ...row,
      id: row.id, 
    }));

    return { countries, totalCount };
  }

  async findByName(name: string): Promise<Country | null> {
  return this.prisma.country.findUnique({
    where: { name },
  });
}


async getAllAlphabetical(): Promise<Country[]> {
  const rows = await this.prisma.country.findMany({
    orderBy: { name: 'asc' },
  });

  return rows.map((row) => ({
    ...row,
    id: row.id, 
  }));
}

}