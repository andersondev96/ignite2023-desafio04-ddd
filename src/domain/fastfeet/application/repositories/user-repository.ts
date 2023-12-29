import { User } from '@/domain/enterprise/entities/User'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByCPF(cpf: string): Promise<User | null>
  create(user: User): Promise<void>
  save(user: User): Promise<void>
  delete(user: User): Promise<void>
}
