import { User } from "../entities/user";
import { IBaseRepository } from "./base-repository";


export interface IAdminRepository extends IBaseRepository<User, string> {
  findByEmail(email: string): Promise<User | null>;
}