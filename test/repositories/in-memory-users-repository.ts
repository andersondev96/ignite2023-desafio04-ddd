import { UserRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/enterprise/entities/User'

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(user: User): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
