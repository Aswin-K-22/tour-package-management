export interface IBaseRepository<T, ID extends string> {
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}