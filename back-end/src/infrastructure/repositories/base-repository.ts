import { IBaseRepository } from '@/domain/repositories/base-repository';
import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T, ID extends string> implements IBaseRepository<T, ID> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return (this.prisma as any)[this.modelName].create({
      data,
    });
  }

  async findById(id: ID): Promise<T | null> {
    return (this.prisma as any)[this.modelName].findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<T[]> {
    return (this.prisma as any)[this.modelName].findMany();
  }

  async update(id: ID, data: Partial<T>): Promise<T> {
    return (this.prisma as any)[this.modelName].update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async delete(id: ID): Promise<void> {
    await (this.prisma as any)[this.modelName].delete({
      where: { id },
    });
  }
}