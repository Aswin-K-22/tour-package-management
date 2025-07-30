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

  // 👇 Required for CreateCityUseCase (to check uniqueness)
  async findByNameAndCountry(name: string, countryId: string): Promise<City | null> {
    return this.prisma.city.findFirst({
      where: {
        name,
        countryId,
      },
    });
  }

  // 👇 Required for GetAllCitiesUseCase with pagination
  // async findAllWithPagination(params: { page: number; limit: number }): Promise<{ cities: City[]; totalCount: number }> {
  //   const { page, limit } = params;

  //   const [cities, totalCount] = await Promise.all([
  //     this.prisma.city.findMany({
  //       skip: (page - 1) * limit,
  //       take: limit,
  //       orderBy: { createdAt: 'desc' },
  //     }),
  //     this.prisma.city.count(),
  //   ]);

  //   return { cities, totalCount };
  // }

  async findAllWithPagination(params: { page: number; limit: number }): Promise<{ cities: any[]; totalCount: number }> {
  const { page, limit } = params;

  const [cities, totalCount] = await Promise.all([
    this.prisma.city.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
  country: {
    select: { name: true },
  },
}
    }),
    this.prisma.city.count(),
  ]);

  return { cities, totalCount };
}


  // 👇 Required for GetAllCitiesAlphabeticalUseCase
  async findAllAlphabetical(): Promise<City[]> {
    return this.prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
