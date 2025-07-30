import { PrismaClient } from '@prisma/client';
import { Schedule } from '@/domain/entities/schedule';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { IScheduleRepository } from '@/domain/repositories/schedule-repository';

export class ScheduleRepository extends BaseRepository<Schedule, string> implements IScheduleRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'schedule');
  }

  async findByPackageId(packageId: string): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { packageId },
    });
  }
}