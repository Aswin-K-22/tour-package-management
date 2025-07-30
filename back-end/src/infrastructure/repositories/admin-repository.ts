import { PrismaClient } from '@prisma/client';
import { User } from '@/domain/entities/user';
import { BaseRepository } from '@/infrastructure/repositories/base-repository';
import { IAdminRepository } from '@/domain/repositories/admin-repository';

export class AdminRepository extends BaseRepository<User, string> implements IAdminRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}